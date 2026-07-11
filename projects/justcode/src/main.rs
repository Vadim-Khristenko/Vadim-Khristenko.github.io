use leptos::*;
use wasm_bindgen::prelude::*;

// ── JS bridge (defined in index.html) ────────────────────────────────
#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = window, js_name = jcHighlight)]
    fn jc_highlight(code: &str, lang: &str) -> String;
    #[wasm_bindgen(js_namespace = window, js_name = jcExport)]
    fn jc_export(scale: f64, filename: &str, format: &str);
    #[wasm_bindgen(js_namespace = window, js_name = jcCopyPng)]
    fn jc_copy_png(scale: f64);
    #[wasm_bindgen(js_namespace = window, js_name = jcCopyText)]
    fn jc_copy_text(text: &str);
    #[wasm_bindgen(js_namespace = window, js_name = jcLang)]
    fn jc_lang() -> String;
    #[wasm_bindgen(js_namespace = window, js_name = jcGet)]
    fn jc_get(key: &str) -> String;
    #[wasm_bindgen(js_namespace = window, js_name = jcSet)]
    fn jc_set(key: &str, val: &str);
}

fn load_str(key: &str, default: &str) -> String {
    let v = jc_get(key);
    if v.is_empty() { default.to_string() } else { v }
}
fn load_i32(key: &str, default: i32) -> i32 {
    jc_get(key).parse().unwrap_or(default)
}
fn load_bool(key: &str, default: bool) -> bool {
    match jc_get(key).as_str() {
        "1" => true,
        "0" => false,
        _ => default,
    }
}

fn tr(lang: &str, ru: &'static str, en: &'static str, zh: &'static str) -> &'static str {
    match lang {
        "ru" => ru,
        "zh" => zh,
        _ => en,
    }
}

const LANGS: &[(&str, &str)] = &[
    ("rust", "Rust"), ("typescript", "TypeScript"), ("javascript", "JavaScript"),
    ("python", "Python"), ("go", "Go"), ("c", "C"), ("cpp", "C++"),
    ("java", "Java"), ("html", "HTML"), ("css", "CSS"), ("json", "JSON"),
    ("bash", "Shell"), ("sql", "SQL"), ("toml", "TOML"), ("yaml", "YAML"),
    ("markdown", "Markdown"), ("plain", "Auto-detect"),
];

const CODE_THEMES: &[(&str, &str)] = &[
    ("night", "Midnight"), ("aurora", "Aurora"), ("sunset", "Ember"),
    ("frost", "Frost"), ("grape", "Grape"), ("mono", "Graphite"),
    ("paper", "Paper (light)"),
];

const BACKDROPS: &[(&str, &str)] = &[
    ("cosmic", "Cosmic"), ("sunset", "Sunset"), ("ocean", "Ocean"),
    ("mint", "Mint"), ("forest", "Forest"), ("peach", "Peach"),
    ("candy", "Candy"), ("grid", "Blueprint"), ("ink", "Ink"), ("none", "Transparent"),
];

const CFONTS: &[(&str, &str)] = &[
    ("jetbrains", "JetBrains Mono"), ("fira", "Fira Code"), ("plex", "IBM Plex Mono"),
];

const CHROMES: &[&str] = &["mac", "windows", "minimal", "tab", "none"];
const FORMATS: &[(&str, &str)] = &[("png", "PNG"), ("jpeg", "JPEG"), ("webp", "WebP"), ("svg", "SVG")];

fn chrome_label(lang: &str, key: &str) -> &'static str {
    match key {
        "mac" => "macOS",
        "windows" => "Windows",
        "minimal" => tr(lang, "Минимал", "Minimal", "极简"),
        "tab" => tr(lang, "Вкладка", "Tab", "标签"),
        _ => tr(lang, "Нет", "None", "无"),
    }
}

const DEFAULT_CODE: &str = r#"// JustCode 2027 — built in Rust, compiled to WebAssembly.
fn main() {
    let year = 2027;
    let mood = ["ship it", "refactor", "sleep"];

    for day in 1..=365 {
        let pick = mood[day % mood.len()];
        println!("Day {day}: today I will {pick}.");
    }

    // paste your own code on the left → export a crisp PNG →
    assert_eq!(year, 2026 + 1, "the future is now");
}"#;

fn flash(toast: RwSignal<String>, msg: &str) {
    toast.set(msg.to_string());
    set_timeout(move || toast.set(String::new()), std::time::Duration::from_millis(1600));
}

#[component]
fn App() -> impl IntoView {
    let ui = create_rw_signal(load_str("ui", &jc_lang()));
    let code = create_rw_signal(load_str("code", DEFAULT_CODE));
    let lang = create_rw_signal(load_str("lang", "rust"));
    let ctheme = create_rw_signal(load_str("ctheme", "night"));
    let backdrop = create_rw_signal(load_str("backdrop", "cosmic"));
    let chrome = create_rw_signal(load_str("chrome", "mac"));
    let cfont = create_rw_signal(load_str("cfont", "jetbrains"));
    let title = create_rw_signal(load_str("title", "main.rs"));
    let padding = create_rw_signal(load_i32("padding", 64));
    let radius = create_rw_signal(load_i32("radius", 16));
    let font = create_rw_signal(load_i32("font", 15));
    let linenums = create_rw_signal(load_bool("linenums", false));
    let shadow = create_rw_signal(load_bool("shadow", true));
    let scale = create_rw_signal(load_i32("scale", 2));
    let fmt = create_rw_signal(load_str("fmt", "png"));
    let toast = create_rw_signal(String::new());
    let editor_ref = create_node_ref::<html::Textarea>();

    // restore the editor's text once it mounts (textarea is uncontrolled)
    editor_ref.on_load(move |el| {
        el.set_value(&code.get_untracked());
    });

    // persist every setting to localStorage on any change
    create_effect(move |_| {
        jc_set("ui", &ui.get());
        jc_set("code", &code.get());
        jc_set("lang", &lang.get());
        jc_set("ctheme", &ctheme.get());
        jc_set("backdrop", &backdrop.get());
        jc_set("chrome", &chrome.get());
        jc_set("cfont", &cfont.get());
        jc_set("title", &title.get());
        jc_set("padding", &padding.get().to_string());
        jc_set("radius", &radius.get().to_string());
        jc_set("font", &font.get().to_string());
        jc_set("linenums", if linenums.get() { "1" } else { "0" });
        jc_set("shadow", if shadow.get() { "1" } else { "0" });
        jc_set("scale", &scale.get().to_string());
        jc_set("fmt", &fmt.get());
    });

    let highlighted = move || jc_highlight(&code.get(), &lang.get());
    let gutter = create_memo(move |_| {
        let n = code.get().lines().count().max(1);
        (1..=n).map(|i| i.to_string()).collect::<Vec<_>>().join("\n")
    });

    let do_export = move |_| {
        let name = { let t = title.get(); if t.trim().is_empty() { "justcode".to_string() } else { t } };
        jc_export(scale.get() as f64, &name, &fmt.get());
        flash(toast, tr(&ui.get(), "Скачивается файл…", "Downloading…", "下载中…"));
    };
    let do_copy_png = move |_| {
        jc_copy_png(scale.get() as f64);
        flash(toast, tr(&ui.get(), "Картинка скопирована ✓", "Image copied ✓", "已复制图片 ✓"));
    };
    let do_copy_code = move |_| {
        jc_copy_text(&code.get());
        flash(toast, tr(&ui.get(), "Код скопирован ✓", "Code copied ✓", "已复制代码 ✓"));
    };

    view! {
        <div class="app">
            <header class="topbar">
                <div class="brand">
                    <a class="home" href="/" title="vai-rice.space"><span class="logo">"{ }"</span></a>
                    <div class="brand-txt">
                        <b>"JustCode"</b>
                        <small>"2027 · rust + wasm"</small>
                    </div>
                </div>
                <div class="top-actions">
                    <a class="btn ghost back" href="/">
                        <span class="ico">"←"</span>
                        <span class="hide-sm">{move || tr(&ui.get(), "На сайт", "Back to site", "返回主站")}</span>
                    </a>
                    <div class="lang-seg">
                        {["ru", "en", "zh"].iter().map(|l| {
                            let key = *l;
                            view! {
                                <button class:on=move || ui.get() == key
                                    on:click=move |_| ui.set(key.to_string())>
                                    {key.to_uppercase()}
                                </button>
                            }
                        }).collect_view()}
                    </div>
                    <button class="btn ghost hide-sm" on:click=do_copy_code>
                        {move || tr(&ui.get(), "Код", "Copy code", "复制代码")}
                    </button>
                    <button class="btn ghost hide-sm" on:click=do_copy_png>
                        {move || tr(&ui.get(), "Картинка", "Copy image", "复制图片")}
                    </button>
                    <button class="btn primary" on:click=do_export>
                        <span class="ico">"↧"</span>
                        {move || tr(&ui.get(), "Экспорт PNG", "Export PNG", "导出 PNG")}
                    </button>
                </div>
            </header>

            <main class="work">
                <aside class="panel">
                    <div class="group">
                        <div class="group-h"><span class="gi">"◆"</span>{move || tr(&ui.get(), "Контент", "Content", "内容")}</div>
                        <label class="field">
                            <span class="flabel">{move || tr(&ui.get(), "Код", "Code", "代码")}</span>
                            <textarea class="editor" spellcheck="false" node_ref=editor_ref
                                on:input=move |ev| code.set(event_target_value(&ev))
                            >{DEFAULT_CODE}</textarea>
                        </label>
                        <div class="row2">
                            <label class="field">
                                <span class="flabel">{move || tr(&ui.get(), "Язык", "Language", "语言")}</span>
                                <select prop:value=move || lang.get()
                                    on:change=move |ev| lang.set(event_target_value(&ev))>
                                    {LANGS.iter().map(|(v, l)| view! { <option value=*v>{*l}</option> }).collect_view()}
                                </select>
                            </label>
                            <label class="field">
                                <span class="flabel">{move || tr(&ui.get(), "Имя файла", "Filename", "文件名")}</span>
                                <input class="text" prop:value=move || title.get()
                                    on:input=move |ev| title.set(event_target_value(&ev)) />
                            </label>
                        </div>
                    </div>

                    <div class="group">
                        <div class="group-h"><span class="gi">"▦"</span>{move || tr(&ui.get(), "Окно", "Window", "窗口")}</div>
                        <label class="field">
                            <span class="flabel">{move || tr(&ui.get(), "Стиль окна", "Window style", "窗口样式")}</span>
                            <div class="seg">
                                {CHROMES.iter().map(|c| {
                                    let key = *c;
                                    let key2 = key.to_string();
                                    view! {
                                        <button class="seg-b" class:on=move || chrome.get() == key
                                            on:click=move |_| chrome.set(key2.clone())>
                                            {move || chrome_label(&ui.get(), key)}
                                        </button>
                                    }
                                }).collect_view()}
                            </div>
                        </label>
                        <label class="field">
                            <span class="flabel">{move || tr(&ui.get(), "Тема кода", "Code theme", "代码主题")}</span>
                            <select prop:value=move || ctheme.get()
                                on:change=move |ev| ctheme.set(event_target_value(&ev))>
                                {CODE_THEMES.iter().map(|(v, l)| view! { <option value=*v>{*l}</option> }).collect_view()}
                            </select>
                        </label>
                        <label class="field">
                            <span class="flabel">{move || tr(&ui.get(), "Шрифт кода", "Code font", "代码字体")}</span>
                            <select prop:value=move || cfont.get()
                                on:change=move |ev| cfont.set(event_target_value(&ev))>
                                {CFONTS.iter().map(|(v, l)| view! { <option value=*v>{*l}</option> }).collect_view()}
                            </select>
                        </label>
                    </div>

                    <div class="group">
                        <div class="group-h"><span class="gi">"❖"</span>{move || tr(&ui.get(), "Фон", "Backdrop", "背景")}</div>
                        <div class="swatches">
                            {BACKDROPS.iter().map(|(v, l)| {
                                let val = v.to_string();
                                let val2 = val.clone();
                                view! {
                                    <button class="swatch" data-bg=*v title=*l
                                        class:on=move || backdrop.get() == val
                                        on:click=move |_| backdrop.set(val2.clone())
                                    ></button>
                                }
                            }).collect_view()}
                        </div>
                    </div>

                    <div class="group">
                        <div class="group-h"><span class="gi">"⚙"</span>{move || tr(&ui.get(), "Макет", "Layout", "布局")}</div>
                        <label class="field">
                            <span class="flabel">{move || format!("{} · {}px", tr(&ui.get(), "Отступ", "Padding", "边距"), padding.get())}</span>
                            <input type="range" min="16" max="140" step="4"
                                prop:value=move || padding.get().to_string()
                                on:input=move |ev| padding.set(event_target_value(&ev).parse().unwrap_or(64)) />
                        </label>
                        <div class="row2">
                            <label class="field">
                                <span class="flabel">{move || format!("{} · {}px", tr(&ui.get(), "Скругление", "Radius", "圆角"), radius.get())}</span>
                                <input type="range" min="0" max="32" step="2"
                                    prop:value=move || radius.get().to_string()
                                    on:input=move |ev| radius.set(event_target_value(&ev).parse().unwrap_or(16)) />
                            </label>
                            <label class="field">
                                <span class="flabel">{move || format!("{} · {}px", tr(&ui.get(), "Размер", "Size", "字号"), font.get())}</span>
                                <input type="range" min="11" max="26" step="1"
                                    prop:value=move || font.get().to_string()
                                    on:input=move |ev| font.set(event_target_value(&ev).parse().unwrap_or(15)) />
                            </label>
                        </div>
                        <label class="switch">
                            <input type="checkbox" prop:checked=move || linenums.get()
                                on:change=move |ev| linenums.set(event_target_checked(&ev)) />
                            <span class="track"></span>
                            <span class="sl">{move || tr(&ui.get(), "Номера строк", "Line numbers", "行号")}</span>
                        </label>
                        <label class="switch">
                            <input type="checkbox" prop:checked=move || shadow.get()
                                on:change=move |ev| shadow.set(event_target_checked(&ev)) />
                            <span class="track"></span>
                            <span class="sl">{move || tr(&ui.get(), "Тень окна", "Window shadow", "窗口阴影")}</span>
                        </label>
                    </div>

                    <div class="group">
                        <div class="group-h"><span class="gi">"↧"</span>{move || tr(&ui.get(), "Экспорт", "Export", "导出")}</div>
                        <label class="field">
                            <span class="flabel">{move || tr(&ui.get(), "Формат", "Format", "格式")}</span>
                            <div class="seg">
                                {FORMATS.iter().map(|(v, l)| {
                                    let key = *v;
                                    let key2 = key.to_string();
                                    view! {
                                        <button class="seg-b" class:on=move || fmt.get() == key
                                            on:click=move |_| fmt.set(key2.clone())>{*l}</button>
                                    }
                                }).collect_view()}
                            </div>
                        </label>
                        <label class="field">
                            <span class="flabel">{move || format!("{} · {}x", tr(&ui.get(), "Разрешение", "Resolution", "分辨率"), scale.get())}</span>
                            <input type="range" min="1" max="4" step="1"
                                prop:value=move || scale.get().to_string()
                                on:input=move |ev| scale.set(event_target_value(&ev).parse().unwrap_or(2)) />
                        </label>
                    </div>
                </aside>

                <section class="stage">
                    <div id="jc-card" class="jc-card"
                        data-bg=move || backdrop.get()
                        style=move || format!("padding:{}px", padding.get())>
                        <div class="jc-win"
                            data-ctheme=move || ctheme.get()
                            data-chrome=move || chrome.get()
                            data-cfont=move || cfont.get()
                            data-shadow=move || if shadow.get() { "on" } else { "off" }
                            style=move || format!("border-radius:{}px", radius.get())>
                            <div class="jc-bar">
                                <div class="jc-dots"><span></span><span></span><span></span></div>
                                <span class="jc-fname">{move || title.get()}</span>
                                <span class="jc-badge">{move || {
                                    let l = lang.get();
                                    LANGS.iter()
                                        .find(|pair| pair.0 == l.as_str())
                                        .map(|pair| pair.1.to_string())
                                        .unwrap_or_else(|| l.to_uppercase())
                                }}</span>
                                <div class="jc-winctrl">
                                    <span class="wc wc-min"></span>
                                    <span class="wc wc-max"></span>
                                    <span class="wc wc-close"></span>
                                </div>
                            </div>
                            <div class="jc-body" class:with-lines=move || linenums.get()
                                style=move || format!("font-size:{}px", font.get())>
                                <Show when=move || linenums.get() fallback=|| ()>
                                    <pre class="jc-gutter">{move || gutter.get()}</pre>
                                </Show>
                                <pre class="jc-code"><code inner_html=highlighted></code></pre>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <div class="toast" class:show=move || !toast.get().is_empty()>{move || toast.get()}</div>
        </div>
    }
}

fn main() {
    console_error_panic_hook::set_once();
    mount_to_body(App);
}
