import Vue from 'vue';

import DoctorKnow from 'ui/DoctorKnow';

require('lib/layout/index.less');
require('ui/theme/default/index.less');

/**
 * Constructor
 *
 * @param {String/HTMLElement/jQuery} [options.el='body']
 *        The element to render application.
 */
function App(options = {}) {
    this.$el = $(options.el || 'body');
}

App.prototype.run = function () {
    this._render();
};

App.prototype._render = function () {
    var me = this;
    me.vm = new Vue({
        el: me.$el[0],
        components: {
            [DoctorKnow.options.name]: DoctorKnow
        },
        attached: function () {
            me.ui = this.$children[0];
        }
    });
};

export default App;
