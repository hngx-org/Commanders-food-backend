const BaseController = require("./base");
const { OrganizationSchema } = require("../helper/validate");
const prisma = require("../config/prisma");
const shortId = require("short-uuid");

class OrganizationController extends BaseController {
    constructor() {
        super();
    }

    async createOrganization(req, res){
        const payload = req.body;
        
        const { error } = OrganizationSchema.validate(payload);
        if (error) {
            return this.error(res, error.message, 400);
        }

        var {organization_name, lunch_price} = payload;
        const id = shortId.generate();

        if (!lunch_price) {
            var lunch_price = "1000";
        }
        console.log("after", lunch_price);

        // Create organization
        await prisma.organization.create({
            data: {
                id: id,
                name: organization_name,
                lunch_price,
            }
        });

        this.success(res, "success",200, {
            message: "organization added sucessfully"
        });
    }
}


module.exports = OrganizationController;