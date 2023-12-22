

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // Lấy đối tượng Canvas trong Cocos Creator
        var canvas = cc.find("Canvas");

        // Lưu kích thước ban đầu của Canvas
        var initialCanvasSize = canvas.getContentSize();

        // Lắng nghe sự kiện thay đổi kích thước của trình duyệt
        window.addEventListener('resize', function () {
            // Lấy kích thước mới của trình duyệt
            var newWidth = window.innerWidth;
            var newHeight = window.innerHeight;

            // Tính tỉ lệ giữa kích thước mới và kích thước ban đầu
            var widthRatio = newWidth / initialCanvasSize.width;
            var heightRatio = newHeight / initialCanvasSize.height;

            // Áp dụng tỉ lệ cho kích thước của Canvas
            canvas.width = newWidth;
            canvas.height = newHeight;

            // Duyệt qua tất cả các node con trong Canvas và cập nhật kích thước của chúng
            canvas.children.forEach(function (child) {
                child.width *= widthRatio;
                child.height *= heightRatio;
            });
            cc.log(canvas.width, canvas.height);

            // Yêu cầu vẽ lại Canvas sau khi thay đổi kích thước
        });

        // Gọi lần đầu tiên để thiết lập kích thước ban đầu
        window.dispatchEvent(new Event('resize'));

            },

            start () {

            },
            

    // update (dt) {},
});


