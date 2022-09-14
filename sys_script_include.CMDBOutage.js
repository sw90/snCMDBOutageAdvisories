var CMDBOutage = Class.create();
CMDBOutage.prototype = Object.extendsObject(AbstractAjaxProcessor, {

    checkExistingOutage: function () {
        var configItemId = this.getParameter('sysparm_id');
        var unplannedOutageGR = new GlideRecord('cmdb_ci_outage');
        unplannedOutageGR.addQuery('cmdb_ci', configItemId);
        unplannedOutageGR.addQuery('type', '!=', 'planned');
        unplannedOutageGR.addNullQuery('end');
        unplannedOutageGR.query();
        if (unplannedOutageGR.next()) {
            var ciClass = new GlideRecord(unplannedOutageGR.cmdb_ci.sys_class_name);
            var className = ciClass.getClassDisplayValue();
            var outageDetails = {};
            outageDetails.type = unplannedOutageGR.type ? unplannedOutageGR.type.toString() : '';
            if (unplannedOutageGR.type == "degradation") {
                outageDetails.advisory = gs.getMessage("An ongoing degradation has been reported for this ") + gs.getMessage(className) + ".";
            }
            if (unplannedOutageGR.type == "outage") {
                outageDetails.advisory = gs.getMessage("An ongoing outage has been reported for this ") + gs.getMessage(className) + ".";
            }
            outageDetails.message = unplannedOutageGR.message ? unplannedOutageGR.message.toString() : '';
            outageDetails.begin = unplannedOutageGR.begin ? unplannedOutageGR.begin.getDisplayValue() : '';
            outageDetails.end = unplannedOutageGR.end ? unplannedOutageGR.end.getDisplayValue() : '';
            outageDetails.task = unplannedOutageGR.task_number ? unplannedOutageGR.task_number.number.toString() : '';
            outageDetails.taskId = unplannedOutageGR.task_number ? unplannedOutageGR.task_number.sys_id.toString() : '';
            return JSON.stringify(outageDetails);
        }

        var plannedOutageGR = new GlideRecord('cmdb_ci_outage');
        plannedOutageGR.addQuery('cmdb_ci', configItemId);
        plannedOutageGR.addQuery('type', 'planned');
        var endTime = plannedOutageGR.addQuery('end', '>', '' + new GlideDateTime());
        endTime.addOrCondition('end', null);
        plannedOutageGR.query();
        if (plannedOutageGR.next()) {
            var ciClass = new GlideRecord(plannedOutageGR.cmdb_ci.sys_class_name);
            var className = ciClass.getClassDisplayValue();
            var outageDetails = {};
            outageDetails.type = plannedOutageGR.type ? plannedOutageGR.type.toString() : '';
            outageDetails.advisory = gs.getMessage("There is currently a planned outage for this ") + gs.getMessage(className) + ".";
            outageDetails.message = plannedOutageGR.message ? plannedOutageGR.message.toString() : '';
            outageDetails.begin = plannedOutageGR.begin ? plannedOutageGR.begin.getDisplayValue() : '';
            outageDetails.end = plannedOutageGR.end ? plannedOutageGR.end.getDisplayValue() : '';
            outageDetails.task = plannedOutageGR.task_number ? plannedOutageGR.task_number.number.toString() : '';
            outageDetails.taskId = plannedOutageGR.task_number ? plannedOutageGR.task_number.sys_id.toString() : '';
            return JSON.stringify(outageDetails);
        }
    },

    type: 'CMDBOutage'
});
