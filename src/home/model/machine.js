'use strict';
/**
 * model
 */
export default class extends think.model.base {
    async getMachineById(machineId) {
        let machineModel = think.model('machine', think.config('db'), 'home');
        let data = await machineModel.where({
            'id': machineId
        }).find();
        return data;
    }

    async getMachinesByProject() {
        let machineModel = think.model('machine', think.config('db'), 'home');
        // let data = await machineModel.where({ 'project_id': projectId }).select();
        let data = await machineModel.field('machine.id,machine.name,op_env_id,is_lock,lock_user,ip,ssh_user,ssh_pass,machine.deploy_hook as deploy_hook,machine.hook_params as hook_params,project_id,name as pro_name').select();
        return data;
    }
    async updateMachine(data) {
        let machineModel = think.model("machine", think.config("db"), "home");
        let affectedRows = await machineModel.where({
            id: data.id
        }).update(data);
        return affectedRows;
    }
    async deleteMachine(id) {
        let machineModel = think.model("machine", think.config("db"), "home");
        let affectedRows = await machineModel.where({
            id: id
        }).delete(id);
        return affectedRows;
    }
    async newMachine(data) {
        let machineModel = think.model("machine", think.config("db"), "home");
        let insertId = await machineModel.add(data);
        return insertId;
    }
}
