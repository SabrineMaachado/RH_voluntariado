let quizSet = new QuizSet(document.getElementById("quiz-set"));

var InitScorm = function () {
    if (typeof pipwerks == "undefined") {
        throw new Error('Biblioteca "pipwerks.SCORM" não encontrada!');
    }

    pipwerks.SCORM.init();
    pipwerks.SCORM.set("cmi.core.lesson_status", "completed");
    pipwerks.SCORM.save();
};

MakeResize(ResizeHelper(1280, 720), { fontSize: 20 });

var StartApp = function () {
    AOS.init();
    makeBulets();
    var sectionsChildrens = jQuery.makeArray($(".sections"));
    
    $("#menu .button,#menu a").click(function () {
        $("#menu").toggleClass("open");
    });

    $("[data-tip]").click(function () {
        $(this).toggleClass("opened");
    });

    $("[data-modal]").each(function () {
        var modal = $("#" + $(this).attr("data-modal"));
        modal.fadeOut();
        modal.find(".close").click(function (argument) {
            modal.fadeOut();
        });
        $(modal).find('.modal-close').on('click', function () {
            $(modal).fadeOut();
        })
        $(this).click(function () {
            $(".modal").hide();
            modal.stop().fadeIn();
        });
    });
    $("[data-modal-close]").each(function (i, element) {

        var modal;
        if ($(this).data('modal-close') == 'self') {
            modal = $(this);
        } else if ($(this).data('modal-close') == 'parent') {
            modal = $(this).parent();
        } else {
            modal = $($(this).data('modal'));
        }
        $(this).on('click', function () {
            $(modal).fadeOut();
        });

    });
    $("[data-show]").click(function () {
        var modalId = $(this).attr("data-show");
        var modal = $("#" + modalId);
        modal.fadeIn();
    });

    $(".slider").each(function () {
        MakeSlider(this);
    });

    $(".page-scroll").click(function () {
        $(".active").removeClass("active");
        $(this).addClass("active");

        if (
            location.pathname.replace(/^\//, "") ==
            this.pathname.replace(/^\//, "") &&
            location.hostname == this.hostname
        ) {
            var target = $(this.hash);
            target = target.length
                ? target
                : $("[name=" + this.hash.slice(1) + "]");
            if (target.length) {
                $("html,body").animate(
                    {
                        scrollTop: target.offset().top
                    },
                    900
                );
                return false;
            }
        }
    });

    $(document).on("scroll", function () {
        var scrollTopBody = $("html").scrollTop();
        var arrBulles = jQuery.makeArray($(".page-scroll"));

        for (var i = 0; i < sectionsChildrens.length; i++) {
            var sectionElement = sectionsChildrens[i];
            var topElement = $(sectionElement).offset().top;

            if (topElement >= scrollTopBody) {
                checkBullet(arrBulles[i]);
                break;
            }
        }
    });

    
};

var makeBulets = function () {
    var sectionsChildrens = jQuery.makeArray($(".sections"));
    for (var i = 0; i < sectionsChildrens.length; i++) {
        var classe = "page-scroll";
        if (i == 0) {
            classe += " active";
        }
        var sectionAtual = sectionsChildrens[i];
        $(".navegacao").append(
            "<a class='" +
            classe +
            "' href='#" +
            sectionAtual.id +
            "'><li></li></a>"
        );
    }
};

var checkBullet = function (element) {
    var arrBulles = jQuery.makeArray($(".page-scroll"));

    for (var i = 0; i < arrBulles.length; i++) {
        $(arrBulles[i]).removeClass("active");
    }
    $(element).addClass("active");
};

StartApp();
InitScorm();
