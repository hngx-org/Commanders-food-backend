const BaseController = require("./base");

class OrganisationController extends BaseController {
    constructor() {
        super();
    }

    // sample function to get organisation 
    async getOrganisation(req, res) {
        const data = [
            {
                id: 'id',
                name: 'name',
                created_at: new Date(),
                note: 'note'
            }
        ];

        this.success(res, 'success', 200, data);
    }
}

module.exports = OrganisationController