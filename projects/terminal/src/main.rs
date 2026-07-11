use leptos::*;
use std::collections::{BTreeSet, HashSet};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = window, js_name = tlang)]
    fn tlang() -> String;
    #[wasm_bindgen(js_namespace = window, js_name = sget)]
    fn sget(key: &str) -> String;
    #[wasm_bindgen(js_namespace = window, js_name = sset)]
    fn sset(key: &str, val: &str);
}

fn tr(lang: &str, ru: &'static str, en: &'static str, zh: &'static str) -> &'static str {
    match lang {
        "ru" => ru,
        "zh" => zh,
        _ => en,
    }
}

#[derive(Clone)]
struct Block {
    prompt: String,
    cmd: Option<String>,
    out: Vec<(String, &'static str)>,
}

// ── built-in read-only files ─────────────────────────────────────────
const FILES: &[(&str, &str)] = &[
    ("/README.md", "VAI Terminal — a portfolio you can explore like a filesystem.\n\nThis whole page is Rust compiled to WebAssembly (Leptos).\nIt understands both bash and PowerShell — try `ls` or `Get-ChildItem`.\n\nYou can also CREATE files: `echo \"hi\" > note.txt`, `touch todo`, `mkdir docs`.\nEverything you make is saved in your browser and restored next visit.\n\nStart with:  help  ·  projects  ·  tree"),
    ("/about.txt", "Vadim Khristenko — VAI_PROG\n\nDeveloper. Systems code, networking, Rust and tidy interfaces.\nBuilding vai-rice.space piece by piece — every project its own style."),
    ("/skills.txt", "Rust · WebAssembly · Leptos\nTypeScript · Vue · Astro · Tailwind\nLinux · Networking · VPN · Self-hosting"),
    ("/contact.txt", "mail   business@vai-rice.space\nsite   vai-rice.space"),
    ("/projects/horizon.md", "# Horizon 2027\nAn interactive, branching New Year experience.\nRust + Leptos + WASM · countdown to the Gregorian AND Chinese New Year.\nopen -> /files/horizon"),
    ("/projects/justcode.md", "# JustCode 2027\nTurn source code into beautiful shareable images.\nRust + Leptos + WASM · themes, window chrome, PNG/JPEG/WebP/SVG.\nopen -> /files/justcode"),
    ("/projects/terminal.md", "# VAI Terminal\nThis very terminal. An explorable command-line portfolio\nwith a writable virtual filesystem and a bash/PowerShell shell."),
    ("/.secret", "You found it. \u{2726}\nThe best way to predict 2027 is to build it. — VAI_PROG"),
];

// ── path + fs helpers (operate on a merged snapshot) ─────────────────
fn resolve(cwd: &str, arg: &str) -> String {
    let mut comps: Vec<String> = Vec::new();
    let a = arg.replace('\\', "/");
    if !a.starts_with('/') {
        for c in cwd.split('/') {
            if !c.is_empty() {
                comps.push(c.to_string());
            }
        }
    }
    for c in a.split('/') {
        match c {
            "" | "." => {}
            ".." => {
                comps.pop();
            }
            x => comps.push(x.to_string()),
        }
    }
    if comps.is_empty() {
        "/".to_string()
    } else {
        format!("/{}", comps.join("/"))
    }
}

fn is_dir(fs: &[(String, String)], path: &str) -> bool {
    if path == "/" {
        return true;
    }
    let pref = format!("{}/", path);
    fs.iter().any(|(p, _)| p.starts_with(pref.as_str()))
}

fn listing(fs: &[(String, String)], dir: &str) -> Vec<(String, bool)> {
    let prefix = if dir == "/" { "/".to_string() } else { format!("{}/", dir) };
    let mut dirs = BTreeSet::new();
    let mut files = BTreeSet::new();
    for (p, _) in fs {
        if let Some(rest) = p.strip_prefix(prefix.as_str()) {
            if rest.is_empty() || rest.starts_with('.') {
                continue; // hide dotfiles
            }
            match rest.find('/') {
                Some(i) => {
                    dirs.insert(rest[..i].to_string());
                }
                None => {
                    files.insert(rest.to_string());
                }
            }
        }
    }
    let mut out: Vec<(String, bool)> = dirs.into_iter().map(|d| (d, true)).collect();
    out.extend(files.into_iter().map(|f| (f, false)));
    out
}

fn build_tree(fs: &[(String, String)], dir: &str, prefix: &str, out: &mut Vec<(String, &'static str)>) {
    let items = listing(fs, dir);
    let n = items.len();
    for (i, (name, is_d)) in items.iter().enumerate() {
        let last = i + 1 == n;
        let branch = if last { "└─ " } else { "├─ " };
        let slash = if *is_d { "/" } else { "" };
        out.push((format!("{}{}{}{}", prefix, branch, name, slash), if *is_d { "link" } else { "" }));
        if *is_d {
            let child = if dir == "/" { format!("/{}", name) } else { format!("{}/{}", dir, name) };
            let np = format!("{}{}", prefix, if last { "   " } else { "│  " });
            build_tree(fs, &child, &np, out);
        }
    }
}

fn write_into(fs: &mut Vec<(String, String)>, path: &str, text: &str, append: bool) {
    if let Some(e) = fs.iter_mut().find(|(p, _)| p.as_str() == path) {
        if append {
            if !e.1.is_empty() {
                e.1.push('\n');
            }
            e.1.push_str(text);
        } else {
            e.1 = text.to_string();
        }
    } else {
        fs.push((path.to_string(), text.to_string()));
    }
}

fn serialize_fs(fs: &[(String, String)]) -> String {
    fs.iter()
        .map(|(p, c)| format!("{}\u{1}{}", p, c))
        .collect::<Vec<_>>()
        .join("\u{2}")
}

fn parse_fs(s: &str) -> Vec<(String, String)> {
    if s.is_empty() {
        return Vec::new();
    }
    s.split('\u{2}')
        .filter_map(|rec| {
            let mut it = rec.splitn(2, '\u{1}');
            let p = it.next()?;
            if p.is_empty() {
                return None;
            }
            Some((p.to_string(), it.next().unwrap_or("").to_string()))
        })
        .collect()
}

const PROMPT_HOST: &str = "vai@rice";

fn make_prompt(cwd: &str) -> String {
    let tail = if cwd == "/" { "~".to_string() } else { format!("~{}", cwd) };
    format!("{}:{}$", PROMPT_HOST, tail)
}

fn banner(lang: &str) -> Block {
    Block {
        prompt: String::new(),
        cmd: None,
        out: vec![
            ("╦  ╦╔═╗╦".to_string(), "art"),
            ("╚╗╔╝╠═╣║".to_string(), "art"),
            (" ╚╝ ╩ ╩╩".to_string(), "art"),
            (tr(lang, "VAI Terminal · интерактивное портфолио", "VAI Terminal · interactive portfolio", "VAI 终端 · 交互式作品集").to_string(), "h"),
            (tr(lang, "bash + PowerShell · записываемая ФС · всё сохраняется в браузере.", "bash + PowerShell · a writable filesystem · everything persists in your browser.", "bash + PowerShell · 可写文件系统 · 一切都保存在浏览器中。").to_string(), "dim"),
            (tr(lang, "Введите 'help' или 'ls'. Стрелка ↑ — история.", "Type 'help' or 'ls'. Arrow ↑ for history.", "输入 'help' 或 'ls'。↑ 键查看历史。").to_string(), "dim"),
        ],
    }
}

fn run(cmd: &str, lang: &str, cwd: &str, fs: &[(String, String)]) -> Vec<(String, &'static str)> {
    let mut parts = cmd.split_whitespace();
    let head = parts.next().unwrap_or("").to_lowercase();
    let rest: Vec<&str> = parts.collect();
    let s = |t: &str| t.to_string();

    match head.as_str() {
        "help" | "man" | "get-help" => vec![
            (tr(lang, "Команды (bash · PowerShell):", "Commands (bash · PowerShell):", "命令（bash · PowerShell）：").to_string(), "h"),
            (format!("  ls · dir · gci        {}", tr(lang, "список файлов", "list files", "列出文件")), ""),
            (format!("  cd · sl               {}", tr(lang, "сменить директорию", "change directory", "切换目录")), ""),
            (format!("  cat · type · gc       {}", tr(lang, "показать файл", "print a file", "查看文件")), ""),
            (format!("  pwd · gl · tree       {}", tr(lang, "путь · дерево", "path · tree", "路径 · 文件树")), ""),
            (format!("  grep · sls            {}", tr(lang, "поиск в файле", "search in a file", "在文件中搜索")), ""),
            (tr(lang, "  ── и записываемая ФС ──", "  ── and a writable FS ──", "  ── 以及可写文件系统 ──").to_string(), "pu"),
            (format!("  touch <f>             {}", tr(lang, "создать файл", "create a file", "创建文件")), ""),
            (format!("  echo <t> > <f>        {}", tr(lang, "записать (>> — дописать)", "write (>> to append)", "写入（>> 追加）")), ""),
            (format!("  mkdir <d> · rm <f>    {}", tr(lang, "папка · удалить", "make dir · remove", "建目录 · 删除")), ""),
            (format!("  save                  {}", tr(lang, "сохранить в память", "save to memory", "保存到内存")), ""),
            (tr(lang, "  ── прочее ──", "  ── misc ──", "  ── 其他 ──").to_string(), "pu"),
            (format!("  about · projects · skills · contact · neofetch"), "dim"),
            (format!("  theme dark|light · lang ru|en|zh · clear · history"), "dim"),
            (tr(lang, "…и пара секретов спрятана в файлах. Поищи.", "…and a couple of secrets hide in the files. Go find them.", "……文件里藏着几个秘密。去找找看。").to_string(), "dim"),
        ],
        "ls" | "dir" | "gci" | "get-childitem" | "ll" => {
            let target = if rest.is_empty() { cwd.to_string() } else { resolve(cwd, rest[0]) };
            if !is_dir(fs, &target) {
                return vec![(format!("ls: {}: {}", rest.first().unwrap_or(&""), tr(lang, "не директория", "not a directory", "不是目录")), "err")];
            }
            let items = listing(fs, &target);
            if items.is_empty() {
                return vec![(tr(lang, "(пусто)", "(empty)", "（空）").to_string(), "dim")];
            }
            items.into_iter().map(|(name, is_d)| if is_d { (format!("{}/", name), "link") } else { (name, "") }).collect()
        }
        "cat" | "type" | "gc" | "get-content" => {
            if rest.is_empty() {
                return vec![(tr(lang, "Использование: cat <файл>", "Usage: cat <file>", "用法：cat <文件>").to_string(), "err")];
            }
            let target = resolve(cwd, rest[0]);
            match fs.iter().find(|(p, _)| p.as_str() == target.as_str()) {
                Some((_, content)) => {
                    if content.is_empty() {
                        vec![(tr(lang, "(пустой файл)", "(empty file)", "（空文件）").to_string(), "dim")]
                    } else {
                        content.lines().map(|l| (l.to_string(), "")).collect()
                    }
                }
                None => vec![(format!("cat: {}: {}", rest[0], tr(lang, "нет такого файла", "no such file", "无此文件")), "err")],
            }
        }
        "pwd" | "gl" | "get-location" => vec![(cwd.to_string(), "")],
        "tree" => {
            let mut lines = vec![(if cwd == "/" { ".".to_string() } else { cwd.to_string() }, "link")];
            build_tree(fs, cwd, "", &mut lines);
            lines
        }
        "grep" | "sls" | "select-string" => {
            if rest.len() < 2 {
                return vec![(tr(lang, "Использование: grep <шаблон> <файл>", "Usage: grep <pattern> <file>", "用法：grep <模式> <文件>").to_string(), "err")];
            }
            let pat = rest[0].to_lowercase();
            let target = resolve(cwd, rest[1]);
            match fs.iter().find(|(p, _)| p.as_str() == target.as_str()) {
                Some((_, content)) => {
                    let hits: Vec<(String, &'static str)> = content
                        .lines()
                        .filter(|l| l.to_lowercase().contains(pat.as_str()))
                        .map(|l| (l.to_string(), "ok"))
                        .collect();
                    if hits.is_empty() {
                        vec![(tr(lang, "(совпадений нет)", "(no matches)", "（无匹配）").to_string(), "dim")]
                    } else {
                        hits
                    }
                }
                None => vec![(format!("grep: {}: {}", rest[1], tr(lang, "нет такого файла", "no such file", "无此文件")), "err")],
            }
        }
        "about" => vec![
            (tr(lang, "Вадим Христенко — VAI_PROG", "Vadim Khristenko — VAI_PROG", "瓦季姆·赫里斯坚科 — VAI_PROG").to_string(), "h"),
            (tr(lang, "Разработчик. Системный код, сети, Rust и аккуратные интерфейсы.", "Developer. Systems code, networking, Rust and tidy interfaces.", "开发者。系统代码、网络、Rust 与整洁的界面。").to_string(), ""),
            (tr(lang, "Собираю vai-rice.space по кусочку — каждый проект в своём стиле.", "Building vai-rice.space piece by piece — each project in its own style.", "一点一点地构建 vai-rice.space —— 每个项目都有自己的风格。").to_string(), "dim"),
        ],
        "whoami" => vec![(s("vai_prog"), "")],
        "projects" => vec![
            (tr(lang, "Проекты:", "Projects:", "项目：").to_string(), "h"),
            (format!("  horizon    {}", tr(lang, "опыт к 2027 (Rust/WASM)", "New Year 2027 experience (Rust/WASM)", "2027 新年体验（Rust/WASM）")), ""),
            (format!("  justcode   {}", tr(lang, "скриншоты кода (Rust/WASM)", "code screenshots (Rust/WASM)", "代码截图（Rust/WASM）")), ""),
            (format!("  terminal   {}", tr(lang, "вот этот терминал (Rust/WASM)", "this very terminal (Rust/WASM)", "就是这个终端（Rust/WASM）")), ""),
            (s("→ cat /projects/horizon.md · /files/justcode"), "link"),
        ],
        "skills" => vec![
            (tr(lang, "Стек:", "Stack:", "技术栈：").to_string(), "h"),
            (s("  Rust · WebAssembly · Leptos"), ""),
            (s("  TypeScript · Vue · Astro · Tailwind"), ""),
            (s("  Linux · Networking · VPN · Self-hosting"), ""),
        ],
        "contact" | "social" => vec![
            (tr(lang, "Связь:", "Contact:", "联系：").to_string(), "h"),
            (s("  mail    business@vai-rice.space"), "link"),
            (s("  site    vai-rice.space"), "link"),
        ],
        "neofetch" => vec![
            (s("   ╦  ╦   vai@rice-space"), "h"),
            (s("   ╚╗╔╝   ─────────────────"), "art"),
            (s("    ╚╝    os      VAI-OS · wasm32"), ""),
            (s("          host    vai-rice.space"), ""),
            (s("          shell   vaish 2.0 (bash + pwsh)"), ""),
            (s("          build   rust + leptos"), ""),
            (s("          uptime  2027 · still shipping"), "dim"),
        ],
        "uname" => vec![(s("VAI-OS web wasm32 · rust + leptos"), "")],
        "echo" | "write-output" | "write-host" => vec![(rest.join(" "), "")],
        "date" | "2027" => vec![(tr(lang, "2027 — год, который ты выбираешь сам.", "2027 — the year you choose yourself.", "2027 —— 你自己选择的一年。").to_string(), "ok")],
        "sudo" => vec![(tr(lang, "Милый, тебе тут root не нужен ✨", "Nice try — you don't need root here ✨", "想得美 —— 这里不需要 root ✨").to_string(), "err")],
        "coffee" => vec![(tr(lang, "☕ Готово. А теперь обратно к коду.", "☕ Done. Now back to the code.", "☕ 好了。现在回去写代码吧。").to_string(), "ok")],
        "" => vec![],
        other => vec![(
            format!("{}: {}", other, tr(lang, "команда не найдена. Введите 'help'.", "command not found. Type 'help'.", "命令未找到。输入 'help'。")),
            "err",
        )],
    }
}

fn line_class(kind: &str) -> &'static str {
    match kind {
        "h" => "l h",
        "dim" => "l dim",
        "err" => "l err",
        "ok" => "l ok",
        "link" => "l link",
        "art" => "l art",
        "pu" => "l pu",
        "rd" => "l rd",
        _ => "l",
    }
}

#[component]
fn App() -> impl IntoView {
    let ui = create_rw_signal(tlang());
    let mode = create_rw_signal("dark".to_string());
    let input = create_rw_signal(String::new());
    let cwd = create_rw_signal("/".to_string());
    let userfs = create_rw_signal(parse_fs(&sget("fs")));
    let history = create_rw_signal({
        let h = sget("hist");
        if h.is_empty() {
            Vec::<String>::new()
        } else {
            h.split('\n').map(|s| s.to_string()).collect()
        }
    });
    let hist_idx = create_rw_signal(-1i32);

    let restored = userfs.get_untracked().len();
    let mut init_log = vec![banner(&ui.get_untracked())];
    if restored > 0 {
        init_log.push(Block {
            prompt: String::new(),
            cmd: None,
            out: vec![(
                format!(
                    "↺ {} {}",
                    restored,
                    tr(&ui.get_untracked(), "файл(ов) восстановлено из памяти. 'ls' — посмотреть.", "file(s) restored from memory. 'ls' to view.", "个文件已从内存恢复。输入 'ls' 查看。")
                ),
                "pu",
            )],
        });
    }
    let log = create_rw_signal(init_log);

    let screen_ref = create_node_ref::<html::Div>();
    let input_ref = create_node_ref::<html::Input>();

    // autoscroll on new output
    create_effect(move |_| {
        log.get();
        if let Some(el) = screen_ref.get() {
            el.set_scroll_top(el.scroll_height());
        }
    });

    // restart the terminal when the language actually changes
    create_effect(move |prev: Option<String>| {
        let l = ui.get();
        if prev.is_some() {
            log.set(vec![banner(&l)]);
            cwd.set("/".to_string());
        }
        l
    });

    // persist filesystem + history to browser storage
    create_effect(move |_| {
        sset("fs", &serialize_fs(&userfs.get()));
    });
    create_effect(move |_| {
        sset("hist", &history.get().join("\n"));
    });

    let submit = move || {
        let raw = input.get();
        let cmd = raw.trim().to_string();
        input.set(String::new());
        hist_idx.set(-1);
        if cmd.is_empty() {
            return;
        }
        history.update(|h| h.push(cmd.clone()));
        let cur_prompt = make_prompt(&cwd.get());
        let head = cmd.split_whitespace().next().unwrap_or("").to_lowercase();
        let rest: Vec<&str> = cmd.split_whitespace().skip(1).collect();
        let arg = rest.first().copied().unwrap_or("").to_string();

        // merged filesystem snapshot (user files shadow built-ins)
        let ufs = userfs.get();
        let have: HashSet<&str> = ufs.iter().map(|(p, _)| p.as_str()).collect();
        let mut fs: Vec<(String, String)> = ufs.clone();
        for (p, c) in FILES {
            if !have.contains(*p) {
                fs.push((p.to_string(), c.to_string()));
            }
        }

        let read_only = |l: &str| tr(l, "файл только для чтения", "read-only file", "只读文件");

        let out: Vec<(String, &'static str)> = match head.as_str() {
            "clear" | "cls" => {
                log.set(vec![]);
                return;
            }
            "theme" => {
                let next = match arg.as_str() {
                    "light" => "light",
                    "dark" => "dark",
                    _ => if mode.get() == "dark" { "light" } else { "dark" },
                };
                mode.set(next.to_string());
                vec![(format!("theme → {}", next), "ok")]
            }
            "lang" => match arg.as_str() {
                "ru" | "en" | "zh" => {
                    ui.set(arg.clone()); // triggers a restart via the effect above
                    vec![]
                }
                _ => vec![(tr(&ui.get(), "Использование: lang ru|en|zh", "Usage: lang ru|en|zh", "用法：lang ru|en|zh").to_string(), "err")],
            },
            "cd" | "sl" | "set-location" => {
                let target = if arg.is_empty() { "/".to_string() } else { resolve(&cwd.get(), &arg) };
                if is_dir(&fs, &target) {
                    cwd.set(target);
                    vec![]
                } else {
                    vec![(format!("cd: {}: {}", arg, tr(&ui.get(), "нет такой директории", "no such directory", "无此目录")), "err")]
                }
            }
            "history" => history.get().iter().enumerate().map(|(i, c)| (format!("  {:>3}  {}", i + 1, c), "dim")).collect(),
            "touch" | "new-item" => {
                if arg.is_empty() {
                    vec![(tr(&ui.get(), "Использование: touch <файл>", "Usage: touch <file>", "用法：touch <文件>").to_string(), "err")]
                } else {
                    let path = resolve(&cwd.get(), &arg);
                    if FILES.iter().any(|(p, _)| *p == path.as_str()) {
                        vec![(read_only(&ui.get()).to_string(), "err")]
                    } else {
                        userfs.update(|f| {
                            if !f.iter().any(|(p, _)| p.as_str() == path.as_str()) {
                                f.push((path.clone(), String::new()));
                            }
                        });
                        vec![]
                    }
                }
            }
            "mkdir" | "md" => {
                if arg.is_empty() {
                    vec![(tr(&ui.get(), "Использование: mkdir <папка>", "Usage: mkdir <dir>", "用法：mkdir <目录>").to_string(), "err")]
                } else {
                    let keep = format!("{}/.keep", resolve(&cwd.get(), &arg));
                    userfs.update(|f| {
                        if !f.iter().any(|(p, _)| p.as_str() == keep.as_str()) {
                            f.push((keep.clone(), String::new()));
                        }
                    });
                    vec![]
                }
            }
            "rm" | "del" | "remove-item" => {
                if arg.is_empty() {
                    vec![(tr(&ui.get(), "Использование: rm <файл>", "Usage: rm <file>", "用法：rm <文件>").to_string(), "err")]
                } else {
                    let path = resolve(&cwd.get(), &arg);
                    if userfs.get().iter().any(|(p, _)| p.as_str() == path.as_str()) {
                        userfs.update(|f| f.retain(|(p, _)| p.as_str() != path.as_str()));
                        vec![]
                    } else if FILES.iter().any(|(p, _)| *p == path.as_str()) {
                        vec![(read_only(&ui.get()).to_string(), "err")]
                    } else {
                        vec![(format!("rm: {}: {}", arg, tr(&ui.get(), "нет такого файла", "no such file", "无此文件")), "err")]
                    }
                }
            }
            "echo" | "write-output" | "write-host" if rest.iter().any(|t| *t == ">" || *t == ">>") => {
                let pos = rest.iter().position(|t| *t == ">" || *t == ">>").unwrap();
                let append = rest[pos] == ">>";
                let text = rest[..pos].join(" ").trim().trim_matches('"').to_string();
                match rest.get(pos + 1) {
                    Some(fname) => {
                        let path = resolve(&cwd.get(), fname);
                        if FILES.iter().any(|(p, _)| *p == path.as_str()) {
                            vec![(read_only(&ui.get()).to_string(), "err")]
                        } else {
                            userfs.update(|f| write_into(f, &path, &text, append));
                            vec![]
                        }
                    }
                    None => vec![(tr(&ui.get(), "Использование: echo текст > файл", "Usage: echo text > file", "用法：echo 文本 > 文件").to_string(), "err")],
                }
            }
            "save" => {
                sset("fs", &serialize_fs(&userfs.get()));
                sset("hist", &history.get().join("\n"));
                vec![(tr(&ui.get(), "Сохранено в память браузера ✓", "Saved to browser memory ✓", "已保存到浏览器内存 ✓").to_string(), "ok")]
            }
            _ => run(&cmd, &ui.get(), &cwd.get(), &fs),
        };
        log.update(|l| l.push(Block { prompt: cur_prompt, cmd: Some(cmd), out }));
    };

    let focus_input = move |_| {
        if let Some(el) = input_ref.get() {
            let _ = el.focus();
        }
    };

    view! {
        <div class="page" class:light=move || mode.get() == "light">
            <div class="device">
                <div class="screen-wrap">
                    <div class="screen">
                      <div class="screen-scroll" node_ref=screen_ref on:click=focus_input>
                        <div class="feed">
                            {move || log.get().into_iter().map(|b| {
                                let pr = b.prompt.clone();
                                let echo = b.cmd.map(|c| view! {
                                    <div class="cmd"><span class="pr">{pr}</span><span class="ct">{c}</span></div>
                                });
                                let lines = b.out.into_iter().map(|(t, k)| view! {
                                    <div class=line_class(k)>{t}</div>
                                }).collect_view();
                                view! { <div class="blk">{echo}{lines}</div> }
                            }).collect_view()}
                        </div>

                        <form class="prompt" on:submit=move |ev| { ev.prevent_default(); submit(); }>
                            <span class="pr">{move || make_prompt(&cwd.get())}</span>
                            <input class="cin" node_ref=input_ref autofocus spellcheck="false"
                                autocomplete="off" autocapitalize="off"
                                prop:value=move || input.get()
                                on:input=move |ev| input.set(event_target_value(&ev))
                                on:keydown=move |ev| {
                                    let key = ev.key();
                                    if key == "ArrowUp" {
                                        ev.prevent_default();
                                        let h = history.get();
                                        if h.is_empty() { return; }
                                        let idx = if hist_idx.get() < 0 { h.len() as i32 - 1 } else { (hist_idx.get() - 1).max(0) };
                                        hist_idx.set(idx);
                                        input.set(h[idx as usize].clone());
                                    } else if key == "ArrowDown" {
                                        ev.prevent_default();
                                        let h = history.get();
                                        let cur = hist_idx.get();
                                        if cur < 0 { return; }
                                        let idx = cur + 1;
                                        if idx >= h.len() as i32 {
                                            hist_idx.set(-1);
                                            input.set(String::new());
                                        } else {
                                            hist_idx.set(idx);
                                            input.set(h[idx as usize].clone());
                                        }
                                    }
                                } />
                        </form>
                      </div>

                        <div class="crt-scan"></div>
                        <div class="crt-beam"></div>
                        <div class="crt-vignette"></div>
                        <div class="crt-flicker"></div>
                    </div>
                </div>

                <div class="chin">
                    <div class="brand">"VAI—CRT"<span class="model">"model 2027"</span></div>
                    <div class="ctrls">
                        <div class="lang-seg">
                            {["ru", "en", "zh"].iter().map(|l| {
                                let key = *l;
                                view! {
                                    <button class:on=move || ui.get() == key
                                        on:click=move |_| ui.set(key.to_string())>{key.to_uppercase()}</button>
                                }
                            }).collect_view()}
                        </div>
                        <button class="mini" title="theme"
                            on:click=move |_| mode.set(if mode.get() == "dark" { "light".into() } else { "dark".into() })>
                            {move || if mode.get() == "dark" { "☀" } else { "☾" }}
                        </button>
                        <a class="mini" href="/" title="vai-rice.space">"⌂"</a>
                        <span class="led" title="power"></span>
                    </div>
                </div>
            </div>
            <p class="foot">{move || tr(&ui.get(), "собрано на Rust + Leptos → WebAssembly", "built with Rust + Leptos → WebAssembly", "由 Rust + Leptos → WebAssembly 构建")}</p>
        </div>
    }
}

fn main() {
    console_error_panic_hook::set_once();
    mount_to_body(App);
}
