function onChange(control, oldValue, newValue, isLoading) {
    if (isLoading || newValue == '') {
        return;
    }

    function processOutageInfo(serverResponse) {
        var answer = serverResponse.responseXML.documentElement.getAttribute('answer');
        var outageInfo = JSON.parse(answer);
        var msg = '';
        if (outageInfo && outageInfo.type) {
            if (outageInfo.task) {
                msg += outageInfo.task + ": ";
            }
            msg += outageInfo.advisory;
            if (outageInfo.end) {
                msg += " Planned end time: " + outageInfo.end + ".";
            }
        }
        if (outageInfo && outageInfo.message) {
            msg += " " + outageInfo.message;
        }
        if (msg) {
            g_form.showFieldMsg('cmdb_ci', msg, 'warning');
        }
    }

    var ga = new GlideAjax('global.CMDBOutage');
    ga.addParam('sysparm_name', 'checkExistingOutage');
    ga.addParam('sysparm_id', newValue);
    ga.getXML(processOutageInfo);

}
