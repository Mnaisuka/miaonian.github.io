(function () {
    (function InitBackGroundImage() {
        $('#background').hide();
        $('#background img').attr("src", "/background/TheLongDark/" + RandomNum(0, 4) + ".jpg")
    }())
    var transl = {}
    fetch('./api/transl.json').then((response) => response.json()).then((json) => {
        transl = json
        InitItem(transl)
    });
    function InitItem() {
        fetch('./api/item.json').then((response) => response.json()).then(async (item) => {
            item.sort(function (a, b) {
                return getTime(b.update) - getTime(a.update)
                function getTime(text) {
                    var match = RegExp('(\\d+)\\D(\\d+)\\D(\\d+)').exec(text)
                    try {
                        return (new Date(`${match[1]}-${match[2]}-${match[3]}`)).getTime()
                    } catch (error) {
                        return (new Date(`1970-01-01`)).getTime()
                    }
                    
                }
            })//时间排序
            for (let i = 0; i < item.length; i++) {
                var focus = item[i]
                if (focus.status < 5) {
                    $('.item.welcome').append(
                        create(focus.title, focus.author, focus.update, focus.game_ver, focus.load_ver, focus.detailed, focus.dependence == "undefined" ? null : focus.dependence, focus.github, focus.download)
                    )
                }
            }
            //绑定事件 - 单击查找模组
            $('.inline.small.introduction').click(
                function (e) {
                    let item = null
                    $('.origin-name').each(
                        function () {
                            if (this.getAttribute('origin') == e.target.innerHTML) {
                                item = this
                            }
                        }
                    )
                    if (!!item) {
                        item.scrollIntoView({
                            "behavior": "smooth",
                            "block": "center"
                        })
                        $(item.parentNode.parentNode).css('background', '#ffebcd8c')
                        setTimeout(
                            function () {
                                $(item.parentNode.parentNode).css('background', '')
                            }, 15000
                        )
                    } else {
                        console.log("项目不存在", item)
                    }
                }
            )
        });
    }
    function create(title, author, update, version, position, introduction, dependence, github, download) {
        var match = /[\d.]+/.exec(version)
        if (match != null) version = match[0];
        var match = /[\d.]+/.exec(position)
        if (match != null) position = match[0];
        var backup = title
        title = transl[title] || title
        introduction = transl[introduction] || introduction
        var match = RegExp('(\\d+)/(\\d+)/(\\d+)').exec(update)
        if (match != null) update = match[3] + "/" + match[2] + "/" + match[1];
        var html = `
        <div class="itemui" style="padding: 20px 30px;text-align: left;border-top: 1px solid #000000;">
            <div>
                <div class="inline title">${title}</div>
                <div class="inline small">作者</div>
                <div class="inline small name">${author}</div>
                <br>
                <div class="inline small" style="color: #000000;">${update}</div>
                <div class="inline small"> | </div>
                <div class="inline small" style="color: #000000;" title="该模组所适用的游戏版本">游戏版本 ${version}</div>
                <div class="inline small"> | </div>
                <div class="inline small" style="color: #000000;" title="该模组所适用的插件版本">前置插件 ${position}</div>
                <div class="inline small"> | </div>
                <div class="inline small origin-name" origin="${backup}" style="color: #000000;">原名 ${backup}</div>
                <div class="inline small"> | </div>
                <a href="${github}" target="_blank" class="inline small" style="color: #000000;">Github</a>
                <div class="inline small"> | </div>
                <a href="${download}" target="_blank" class="inline small" style="color: #002caf;">下载</a>
                <br>
                <div style="padding-top: 4px;border-top: 1px solid #606160;margin-top: 2px;"></div>
                <div class="inline small introduction" style="text-shadow: 0px 0px 1px #6c6c6c;">${introduction}</div>
                <br>
                <div style="padding-top: 8px;">
                ${!!dependence ? `<div class="inline small introduction" style="color: #000000;" title="使用该模组前,需安装的模组">模组依赖 </div>` : ""}
                ${!!dependence ? `<div class="inline small"> | </div>` : ""}
                ${dependence_html(dependence)}
                </div>
            </div>
        </div>`
        return html
        function dependence_html(dependence) {
            if (!dependence) {
                return ""
            }
            dependence = dependence.split(',')
            html = []
            for (index in dependence) {
                let tl = dependence[index]
                html.push(`<div class="inline small introduction" style="color: #004aa1;" title="${transl[tl] || tl}">${tl}</div>`)
            }
            return html.join('<div class="inline small" style="padding-right: 2px;padding-left: 2px;color: black;font-size: 15px;"> , </div>')

        }
    }
    function RandomNum(Min, Max) {
        var Range = Max - Min;
        var Rand = Math.random();
        var num = Min + Math.floor(Rand * Range); //舍去
        return num;
    }
}())
function buckground_load() {
    $('#background').show(1500);
}
