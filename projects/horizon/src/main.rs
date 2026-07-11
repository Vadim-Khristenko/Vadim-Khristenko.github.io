use js_sys::Date;
use leptos::*;
use std::time::Duration;

fn main() {
    console_error_panic_hook::set_once();
    mount_to_body(|| view! { <App/> });
}

/// pick a localized string
fn tr(lang: &str, ru: &'static str, en: &'static str, zh: &'static str) -> &'static str {
    match lang {
        "en" => en,
        "zh" => zh,
        _ => ru,
    }
}

fn accent_style(path: &str) -> String {
    let (a, glow) = match path {
        "fire" => ("#ff6a3d", "rgba(255,106,61,0.45)"),
        "flow" => ("#38d6c8", "rgba(56,214,200,0.42)"),
        "silence" => ("#a78bfa", "rgba(167,139,250,0.42)"),
        _ => ("#8aa2ff", "rgba(138,162,255,0.40)"),
    };
    format!("--accent:{a};--glow:{glow}")
}

/// percent-encode a string (UTF-8 safe) for data: / query URLs
fn enc(s: &str) -> String {
    let mut out = String::new();
    for b in s.bytes() {
        match b {
            b'A'..=b'Z' | b'a'..=b'z' | b'0'..=b'9' | b'-' | b'_' | b'.' | b'~' => out.push(b as char),
            _ => out.push_str(&format!("%{:02X}", b)),
        }
    }
    out
}

/// a closing blessing woven from the chosen path + companion (path line + token tail)
fn blessing(lang: &str, path: &str, token: &str) -> String {
    let line = match path {
        "fire" => tr(lang, "Гори ярко — но не спали мосты.", "Burn bright — but don't burn bridges.", "燃得明亮 —— 但别烧了桥。"),
        "flow" => tr(lang, "Течёшь — значит живёшь. Не застывай.", "To flow is to live. Don't freeze.", "流动即活着。别凝固。"),
        "silence" => tr(lang, "В тишине рождается ясность.", "Clarity is born in silence.", "清晰生于宁静。"),
        _ => tr(lang, "Каждый путь — твой.", "Every path is yours.", "每条路都是你的。"),
    };
    let tail = match token {
        "courage" => tr(lang, "И начни — сегодня.", "And begin — today.", "而且开始 —— 就在今天。"),
        "patience" => tr(lang, "И дай времени время.", "And give time its time.", "而且给时间以时间。"),
        "curiosity" => tr(lang, "И оставайся открытым.", "And stay open.", "而且保持开放。"),
        _ => tr(lang, "И иди дальше.", "And keep going.", "而且继续前行。"),
    };
    format!("{line} {tail}")
}

#[component]
fn App() -> impl IntoView {
    let lang = create_rw_signal(String::from("ru"));
    let step = create_rw_signal(0usize);
    let path = create_rw_signal(String::from("aurora"));
    let token = create_rw_signal(String::new());
    // countdown target in zh locale: true = Chinese New Year, false = Gregorian
    let cn_target = create_rw_signal(true);

    // live clock for the countdown
    let now = create_rw_signal(Date::now());
    set_interval(move || now.set(Date::now()), Duration::from_secs(1));

    view! {
        <main class="stage" style=move || accent_style(&path.get())>
            <div class="bg-aurora"></div>
            <div class="bg-stars"></div>

            <div class="lang-switch">
                <button class="lang" class:on=move || lang.get() == "ru" on:click=move |_| lang.set("ru".into())>"RU"</button>
                <button class="lang" class:on=move || lang.get() == "en" on:click=move |_| lang.set("en".into())>"EN"</button>
                <button class="lang" class:on=move || lang.get() == "zh" on:click=move |_| lang.set("zh".into())>"ZH"</button>
            </div>

            <div class="frame">
                {move || match step.get() {
                    0 => intro(lang, step).into_view(),
                    1 => fork_enter(lang, step, path).into_view(),
                    2 => passage(lang, step, path).into_view(),
                    3 => fork_token(lang, step, token).into_view(),
                    4 => lunar(lang, step).into_view(),
                    _ => finale(lang, step, path, token, now, cn_target).into_view(),
                }}
            </div>

            <footer class="cred">
                <span>"Horizon 2027"</span>
                <span class="tech">"Rust · Leptos · WASM"</span>
                <a href="/">"vai-rice.space"</a>
            </footer>
        </main>
    }
}

fn intro(lang: RwSignal<String>, step: RwSignal<usize>) -> impl IntoView {
    view! {
        <section class="scene intro">
            <p class="eyebrow">"HORIZON · MMXXVII"</p>
            <h1 class="year">"2027"</h1>
            <p class="lead">{move || tr(&lang.get(),
                "Год ещё не наступил — но уже смотрит на тебя.",
                "The year hasn't come yet — but it's already looking at you.",
                "新的一年还未到来 —— 但它已经在看着你。")}</p>
            <p class="muted">{move || tr(&lang.get(),
                "Останься на секунду. Прежде чем прыгнуть, выбери, каким войдёшь.",
                "Stay a second. Before you jump, choose how you'll enter.",
                "停留一秒。在纵身一跃之前，选择你将以何种姿态进入。")}</p>
            <button class="btn primary" on:click=move |_| step.set(1)>
                {move || tr(&lang.get(), "Войти", "Enter", "进入")}<span class="arr">"→"</span>
            </button>
        </section>
    }
}

fn fork_enter(lang: RwSignal<String>, step: RwSignal<usize>, path: RwSignal<String>) -> impl IntoView {
    view! {
        <section class="scene fork">
            <h2 class="q">{move || tr(&lang.get(),
                "Каким ты входишь в 2027?", "How do you enter 2027?", "你以何种姿态进入 2027？")}</h2>
            <div class="choices">
                <button class="choice c-fire" on:click=move |_| { path.set("fire".into()); step.set(2); }>
                    <span class="ch-glyph">"✷"</span>
                    <span class="ch-title">{move || tr(&lang.get(), "С огнём", "With fire", "带着火焰")}</span>
                    <span class="ch-sub">{move || tr(&lang.get(), "Гореть, а не тлеть.", "Burn, don't smoulder.", "燃烧，而非阴燃。")}</span>
                </button>
                <button class="choice c-flow" on:click=move |_| { path.set("flow".into()); step.set(2); }>
                    <span class="ch-glyph">"≈"</span>
                    <span class="ch-title">{move || tr(&lang.get(), "С потоком", "With flow", "随波逐流")}</span>
                    <span class="ch-sub">{move || tr(&lang.get(), "Течь и не ломаться.", "Flow and don't break.", "流动而不折断。")}</span>
                </button>
                <button class="choice c-silence" on:click=move |_| { path.set("silence".into()); step.set(2); }>
                    <span class="ch-glyph">"◦"</span>
                    <span class="ch-title">{move || tr(&lang.get(), "С тишиной", "With silence", "带着宁静")}</span>
                    <span class="ch-sub">{move || tr(&lang.get(), "Слышать себя в шуме.", "Hear yourself in the noise.", "在喧嚣中听见自己。")}</span>
                </button>
            </div>
        </section>
    }
}

fn passage(lang: RwSignal<String>, step: RwSignal<usize>, path: RwSignal<String>) -> impl IntoView {
    let title = move || match path.get().as_str() {
        "fire" => tr(&lang.get(), "Огонь", "Fire", "火"),
        "flow" => tr(&lang.get(), "Поток", "Flow", "流"),
        "silence" => tr(&lang.get(), "Тишина", "Silence", "静"),
        _ => tr(&lang.get(), "Путь", "Path", "路"),
    };
    let body = move || match path.get().as_str() {
        "fire" => tr(&lang.get(),
            "Ты выбрал гореть. 2027 не про то, чтобы успеть везде — про то, чтобы гореть там, где важно. Один проект, доведённый до конца, ярче сотни начатых.",
            "You chose to burn. 2027 isn't about being everywhere — it's about burning where it matters. One project, finished, outshines a hundred that were only started.",
            "你选择燃烧。2027 不在于无处不在 —— 而在于在重要之处燃烧。一个做完的项目，胜过一百个只是开了头的。"),
        "flow" => tr(&lang.get(),
            "Ты выбрал течь. Планы сломаются — и это нормально. Сила не в том, чтобы держать курс любой ценой, а в том, чтобы находить новое русло и не терять себя по дороге.",
            "You chose to flow. Plans will break — and that's fine. Strength isn't holding the course at any cost; it's finding a new channel without losing yourself.",
            "你选择流动。计划会破碎 —— 这很正常。力量不在于不惜代价坚持航向，而在于找到新的河道，且不迷失自己。"),
        "silence" => tr(&lang.get(),
            "Ты выбрал тишину. В мире, который кричит, самый смелый поступок — сосредоточиться. Закрой лишние вкладки. Год начинается с одной ясной мысли.",
            "You chose silence. In a world that screams, the bravest act is to focus. Close the extra tabs. A year begins with one clear thought.",
            "你选择宁静。在一个喧嚣的世界里，最勇敢的举动是专注。关掉多余的标签页。一年始于一个清晰的念头。"),
        _ => tr(&lang.get(), "Каждый путь ведёт вперёд.", "Every path leads forward.", "每条路都通向前方。"),
    };
    view! {
        <section class="scene passage">
            <p class="p-mark">"·"</p>
            <h2 class="p-title">{title}</h2>
            <p class="p-body">{body}</p>
            <button class="btn" on:click=move |_| step.set(3)>
                {move || tr(&lang.get(), "Дальше", "Next", "继续")}<span class="arr">"→"</span>
            </button>
        </section>
    }
}

fn fork_token(lang: RwSignal<String>, step: RwSignal<usize>, token: RwSignal<String>) -> impl IntoView {
    view! {
        <section class="scene fork">
            <h2 class="q">{move || tr(&lang.get(), "Что возьмёшь с собой?", "What will you take with you?", "你会带上什么？")}</h2>
            <div class="choices tokens">
                <button class="choice" on:click=move |_| { token.set("courage".into()); step.set(4); }>
                    <span class="ch-title">{move || tr(&lang.get(), "Смелость", "Courage", "勇气")}</span>
                    <span class="ch-sub">{move || tr(&lang.get(), "Начинать до готовности.", "Begin before you're ready.", "在准备好之前开始。")}</span>
                </button>
                <button class="choice" on:click=move |_| { token.set("patience".into()); step.set(4); }>
                    <span class="ch-title">{move || tr(&lang.get(), "Терпение", "Patience", "耐心")}</span>
                    <span class="ch-sub">{move || tr(&lang.get(), "Долгое важнее быстрого.", "The long game beats the fast one.", "长久胜过快速。")}</span>
                </button>
                <button class="choice" on:click=move |_| { token.set("curiosity".into()); step.set(4); }>
                    <span class="ch-title">{move || tr(&lang.get(), "Любопытство", "Curiosity", "好奇")}</span>
                    <span class="ch-sub">{move || tr(&lang.get(), "Дверей больше, чем кажется.", "There are more doors than you think.", "门比你以为的多。")}</span>
                </button>
            </div>
        </section>
    }
}

fn lunar(lang: RwSignal<String>, step: RwSignal<usize>) -> impl IntoView {
    view! {
        <section class="scene lunar">
            <p class="eyebrow">{move || tr(&lang.get(), "НО У ГОДА ДВА НАЧАЛА", "BUT THE YEAR HAS TWO BEGINNINGS", "但一年有两个开端")}</p>
            <div class="hanzi">"丁未"</div>
            <h2 class="p-title">{move || tr(&lang.get(), "Год Огненной Козы", "Year of the Fire Goat", "火羊年")}</h2>
            <p class="p-body">{move || tr(&lang.get(),
                "6 февраля 2027-го начнётся ещё один год — по лунному календарю. 丁未, Огненная Коза: год мягкой силы, тихого творчества и упрямой доброты. Два начала — два шанса начать заново.",
                "On February 6, 2027, another year begins — by the lunar calendar. 丁未, the Fire Goat: a year of gentle strength, quiet creativity and stubborn kindness. Two beginnings — two chances to start over.",
                "2027 年 2 月 6 日，另一个年份开始 —— 按农历。丁未，火羊：温柔的力量、安静的创造力与倔强善意之年。两个开端 —— 两次重新开始的机会。")}</p>
            <button class="btn" on:click=move |_| step.set(5)>
                {move || tr(&lang.get(), "К прыжку", "To the jump", "去纵身一跃")}<span class="arr">"→"</span>
            </button>
        </section>
    }
}

fn finale(
    lang: RwSignal<String>,
    step: RwSignal<usize>,
    path: RwSignal<String>,
    token: RwSignal<String>,
    now: RwSignal<f64>,
    cn_target: RwSignal<bool>,
) -> impl IntoView {

    let mood_word = move || match path.get().as_str() {
        "fire" => tr(&lang.get(), "с огнём", "with fire", "带着火焰"),
        "flow" => tr(&lang.get(), "с потоком", "with flow", "随着流动"),
        "silence" => tr(&lang.get(), "с тишиной", "with silence", "带着宁静"),
        _ => tr(&lang.get(), "налегке", "light", "轻装"),
    };
    let token_word = move || match token.get().as_str() {
        "courage" => tr(&lang.get(), "смелость", "courage", "勇气"),
        "patience" => tr(&lang.get(), "терпение", "patience", "耐心"),
        "curiosity" => tr(&lang.get(), "любопытство", "curiosity", "好奇"),
        _ => tr(&lang.get(), "надежду", "hope", "希望"),
    };

    // zh locale counts down to the Chinese New Year (丁未, Feb 6 2027) by default,
    // with a toggle to the Gregorian one. Other locales: Gregorian.
    let use_cn = create_memo(move |_| lang.get() == "zh" && cn_target.get());

    let cd = create_memo(move |_| {
        let target = if use_cn.get() {
            Date::parse("2027-02-06T00:00:00")
        } else {
            Date::parse("2027-01-01T00:00:00")
        };
        let diff = (target - now.get()).max(0.0);
        let secs = (diff / 1000.0) as i64;
        (secs / 86400, (secs % 86400) / 3600, (secs % 3600) / 60, secs % 60)
    });

    // calendar links (rebuild reactively from locale + target)
    let ics_href = move || {
        let cn = use_cn.get();
        let lg = lang.get();
        let d = if cn { "20270206" } else { "20270101" };
        let title = if cn {
            tr(&lg, "Китайский Новый год · 丁未", "Chinese New Year · 丁未", "农历新年 · 丁未")
        } else {
            tr(&lg, "Новый год 2027", "New Year 2027", "2027 新年")
        };
        let desc = tr(&lg, "Прыжок совершён. С Новым годом — от VAI_PROG.", "The jump is made. Happy New Year — from VAI_PROG.", "纵身已成。新年快乐 —— 来自 VAI_PROG。");
        let ics = format!(
            "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//VAI_PROG//Horizon 2027//EN\r\nBEGIN:VEVENT\r\nUID:horizon-{d}@vai-rice.space\r\nDTSTART;VALUE=DATE:{d}\r\nSUMMARY:{title}\r\nDESCRIPTION:{desc}\r\nURL:https://vai-rice.space/\r\nEND:VEVENT\r\nEND:VCALENDAR"
        );
        format!("data:text/calendar;charset=utf-8,{}", enc(&ics))
    };
    let gcal_href = move || {
        let cn = use_cn.get();
        let lg = lang.get();
        let (d, d2) = if cn { ("20270206", "20270207") } else { ("20270101", "20270102") };
        let title = if cn {
            tr(&lg, "Китайский Новый год · 丁未", "Chinese New Year · 丁未", "农历新年 · 丁未")
        } else {
            tr(&lg, "Новый год 2027", "New Year 2027", "2027 新年")
        };
        format!(
            "https://calendar.google.com/calendar/render?action=TEMPLATE&text={}&dates={}/{}",
            enc(title), d, d2
        )
    };
    let dd = move || format!("{:02}", cd.get().0);
    let hh = move || format!("{:02}", cd.get().1);
    let mm = move || format!("{:02}", cd.get().2);
    let ss = move || format!("{:02}", cd.get().3);

    view! {
        <section class="scene finale">
            <h1 class="done">{move || tr(&lang.get(), "Прыжок совершён.", "The jump is made.", "纵身已成。")}</h1>
            <p class="lead">{move || tr(&lang.get(), "2027 — чистый холст.", "2027 is a blank canvas.", "2027 是一张白纸。")}</p>
            <p class="recap">
                {move || tr(&lang.get(), "Ты входишь ", "You enter ", "你 ")}
                <b>{mood_word}</b>
                {move || tr(&lang.get(), ", взяв с собой ", ", carrying ", " 进入，带着 ")}
                <b>{token_word}</b>
                {move || tr(&lang.get(), ".", ".", "。")}
            </p>

            <p class="blessing">{move || blessing(&lang.get(), &path.get(), &token.get())}</p>

            {move || if lang.get() == "zh" {
                view! {
                    <div class="cn-toggle">
                        <button class:on=move || cn_target.get() on:click=move |_| cn_target.set(true)>"农历 · 丁未"</button>
                        <button class:on=move || !cn_target.get() on:click=move |_| cn_target.set(false)>"公历 · 2027"</button>
                    </div>
                }.into_view()
            } else { ().into_view() }}

            <div class="countdown">
                <p class="cd-label">{move || if use_cn.get() {
                    tr(&lang.get(), "До китайского НГ осталось", "Until Chinese New Year", "距离农历新年还有")
                } else {
                    tr(&lang.get(), "До 2027-го осталось", "Until 2027", "距离 2027 还有")
                }}</p>
                <div class="cd-grid">
                    <div class="cd-cell"><span class="cd-num">{dd}</span><span class="cd-u">{move || tr(&lang.get(), "дн", "d", "天")}</span></div>
                    <div class="cd-cell"><span class="cd-num">{hh}</span><span class="cd-u">{move || tr(&lang.get(), "ч", "h", "时")}</span></div>
                    <div class="cd-cell"><span class="cd-num">{mm}</span><span class="cd-u">{move || tr(&lang.get(), "мин", "m", "分")}</span></div>
                    <div class="cd-cell"><span class="cd-num">{ss}</span><span class="cd-u">{move || tr(&lang.get(), "сек", "s", "秒")}</span></div>
                </div>
            </div>

            <div class="cal-row">
                <a class="btn sm" href=ics_href download="new-year-2027.ics">
                    <span class="cal-ico">"↧"</span>{move || tr(&lang.get(), "В календарь", "Add to calendar", "加入日历")}
                </a>
                <a class="btn sm" href=gcal_href target="_blank" rel="noopener">"Google Calendar"</a>
            </div>

            <p class="muted">{move || tr(&lang.get(), "Пусть код компилируется с первого раза.", "May your code compile on the first try.", "愿你的代码一次编译通过。")}</p>
            <div class="actions">
                <a class="btn primary" href="/">{move || tr(&lang.get(), "На vai-rice.space", "To vai-rice.space", "前往 vai-rice.space")}<span class="arr">"→"</span></a>
                <button class="btn ghost" on:click=move |_| {
                    step.set(0);
                    path.set("aurora".into());
                    token.set(String::new());
                }>{move || tr(&lang.get(), "Пройти заново", "Start over", "重新开始")}</button>
            </div>
        </section>
    }
}
