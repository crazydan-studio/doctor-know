import Vue from 'vue';

import Knowledge from './knowledge/Knowledge';

var DoctorKnow = Vue.extend({
    name: 'doctor-know',
    components: {
        'knowledge.input': Knowledge.Input
    }
});

export default DoctorKnow;
