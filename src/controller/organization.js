const BaseController = require("./base");
const { OrganizationSchema } = require("../helper/validate");
const prisma = require("../config/prisma");

class OrganizationController extends BaseController {
    constructor() {
        super();
    }

    async updateOrganizationInfo(req, res){
        const{org_id} = req.user;
        const payload = req.body;

        //validating payload
        const { error } = OrganizationSchema.validate(payload);
        if (error) {
            return this.error(res, error.message, 400);
        }

        const {organization_name, lunch_price} = payload;

        //update to database
        await prisma.organization.update({
            where: {
              id: org_id,
            },
            data: {
              name: organization_name,
              lunch_price: String(lunch_price)
            }, 
          });

        this.success(res, "success", 200);
    }
}

module.exports = OrganizationController;