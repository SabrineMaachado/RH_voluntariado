'use strict';

var MakeResizeAspect = {
    CONTAIN: 'contain',
    COVER: 'cover'
};

var MakeResizeDimentions = {
    width: 0,
    height: 0
};

/**
 * @param {number} _width
 * @param {number} _height
 * @returns {{ WIDTH: number, HEIGHT: number, RATIO:number, widthProportion:Function, heightProportion:Function, keyProperty:Function }}
*/
function ResizeHelper(_width, _height) {
    return {
        WIDTH: _width,
        HEIGHT: _height,
        RATIO: _width / _height,
        widthProportion: function widthProportion(width) {
            return width / this.WIDTH * 100;
        },
        heightProportion: function heightProportion(height) {
            return height / this.HEIGHT * 100;
        },
        keyProperty: function keyProperty(aspect) {
            return window.innerWidth / window.innerHeight > this.RATIO && aspect != MakeResizeAspect.COVER ? 'height' : 'width';
        }
    };
}

/**
 * @param {Array<string>} content
 * @returns
 */
function code_block(content) {
    return ['{', content, '}'].join(' ');
}

/**
 * @param {{ left: number, top: number, width: number, height: number, fontSize: number }} stylesHolder
 * @returns {string} css style
*/
function createCSS(stylesHolder) {

    var style_width = ['width: ' + stylesHolder.width];
    var style_height = ['height: ' + stylesHolder.height];
    var style_left = ['left: ' + stylesHolder.left];
    var style_top = ['top: ' + stylesHolder.top];
    var style_right = ['right: ' + stylesHolder.left];
    var style_bottom = ['bottom: ' + stylesHolder.top];

    var style_size = [].concat(style_width).concat(style_height);
    var style_position = ['position: absolute'].concat(style_left).concat(style_top);

    var style_horz = ['position: absolute'].concat(style_width).concat(style_left);
    var style_vert = ['position: absolute'].concat(style_height).concat(style_top);

    var style_full = [].concat(style_position).concat(style_size);

    var styleAll = [];

    styleAll.push('.mr-full ' + code_block(style_full.join('; ')));

    styleAll.push('.mr-horz ' + code_block(style_horz.join('; ')));
    styleAll.push('.mr-vert ' + code_block(style_vert.join('; ')));

    styleAll.push('.mr-size ' + code_block(style_size.join('; ')));
    styleAll.push('.mr-width ' + code_block(style_width.join('; ')));
    styleAll.push('.mr-height ' + code_block(style_height.join('; ')));

    styleAll.push('.mr-position ' + code_block(style_position.join('; ')));
    styleAll.push('.mr-left ' + code_block(style_left.join('; ')));
    styleAll.push('.mr-top ' + code_block(style_top.join('; ')));
    styleAll.push('.mr-right ' + code_block(style_right.join('; ')));
    styleAll.push('.mr-bottom ' + code_block(style_bottom.join('; ')));

    if (stylesHolder.hasOwnProperty('fontSize')) {
        var style_fontSize = ['font-size: ' + stylesHolder.fontSize];
        styleAll.push('html ' + code_block(style_fontSize.join('; ')));
    }
    for (const rule in stylesHolder.custom) {
        let value = stylesHolder.custom[rule];
        styleAll.push('.mr-' + rule + code_block(rule + ': ' + stylesHolder[value] + ";"));
    }
    return styleAll.join('\n');
}
/**
 *
 *
 * @param {string} property
 * @param {number} fontSize
 * @param {number} width
 * @param {number} height
 * @returns {number}
 */
function calculateFont(resizeHelper, _aspect, fontSize, width, height) {
    var newFontSize = 0;
    if (resizeHelper.keyProperty(_aspect) == 'height') {
        newFontSize = height / resizeHelper.HEIGHT * fontSize;
    } else {
        newFontSize = width / resizeHelper.WIDTH * fontSize;
    }
    return newFontSize;
}

/**
 * @param {ResizeHelper} resizeHelper
 * @param {{ fontSize: number }} config
 * @returns {void} void
*/
function MakeResize(resizeHelper, config) {
    var _desiredRatio = resizeHelper.RATIO || 1000 / 600;
    var _config = Object.assign({ customClasses: {} }, config);
    var _aspect = _config.aspect || MakeResizeAspect.CONTAIN;
    var methods = {};
    var head = document.querySelector('head');
    var style = document.createElement('style');
    head.appendChild(style);

    methods[MakeResizeAspect.CONTAIN] = function (actualWidth, actualHeight) {
        return actualWidth / actualHeight > _desiredRatio ? {
            width: actualHeight * _desiredRatio,
            height: actualHeight
        } : {
                width: actualWidth,
                height: actualWidth / _desiredRatio
            };
    };

    methods[MakeResizeAspect.COVER] = function (actualWidth, actualHeight) {
        return actualWidth / actualHeight > _desiredRatio ? {
            width: actualWidth,
            height: actualWidth / _desiredRatio
        } : {
                width: actualHeight * _desiredRatio,
                height: actualHeight
            };
    };

    function resize() {
        var retorno = methods[_aspect](window.innerWidth, window.innerHeight);
        var width = retorno.width;
        var height = retorno.height;
        MakeResizeDimentions.width = width;
        MakeResizeDimentions.height = height;

        var stylesHolder = {
            custom: [],
            left: (width - window.innerWidth).toFixed(2) / -2 + 'px',
            top: (height - window.innerHeight).toFixed(2) / -2 + 'px',
            width: width + 'px',
            height: height + 'px',
            fontSize: calculateFont(resizeHelper, _config.aspect, _config.fontSize, width, height) + 'px'
        };
        stylesHolder.custom = Object.assign({}, _config.customClasses);
        style.innerHTML = createCSS(stylesHolder);
    };

    window.addEventListener('resize', resize);
    resize();
}