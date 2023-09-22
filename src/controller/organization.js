const BaseController = require("./base");
const { OrganizationSchema } = require("../helper/validate");
const prisma = require("../config/prisma");

class OrganizationController extends BaseController {
    constructor() {
        super();
    }

    async updateOrganization(req, res){
        const{org_id} = req.user;
        const payload = req.body;

        //validating payload
        const { error } = OrganizationSchema.validate(payload);
        if (error) {
            return this.error(res, error.message, 400);
        }

        var {organization_name, lunch_price} = payload;

        //find organization
        const organization = await prisma.organization.findUnique({
            where: {
              id: org_id,
            },
          });
        
        // Setting default value of lunch price when not specified
        if (!lunch_price) {
            var lunch_price = "1000";
        }

        // update organization
        organization.name = organization_name;
        organization.lunch_price = lunch_price;

        //update to database
        await prisma.organization.update({
            where: {
              id: org_id,
            },
            data: organization, 
          });

        this.success(res, "success",200, {
            message: "organization added sucessfully"
        });
    }
}

module.exports = OrganizationController;