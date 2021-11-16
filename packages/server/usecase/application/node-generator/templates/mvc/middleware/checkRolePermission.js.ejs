const mongoose = require('mongoose');
const UserRole = require('../model/userRole');
const RouteRole = require('../model/routeRole');
const ProjectRoute = require('../model/projectRoute');
const { replaceAll } = require('../utils/common');

const checkRolePermission = async (req, res, next) => {
  if (req.user) {
    const loggedInUserId = req.user.id;
    let rolesOfUser = await UserRole.find({
      userId: loggedInUserId,
      isActive: true,
      isDeleted: false,
    }, {
      roleId: 1,
      _id: 0,
    });
    if (rolesOfUser && rolesOfUser.length) {
      rolesOfUser = rolesOfUser.map((role) => mongoose.Types.ObjectId(role.roleId));
      const route = await ProjectRoute.findOne({
        route_name: replaceAll((req.route.path.toLowerCase()).substring(1), '/', '_'),
        uri: req.route.path.toLowerCase(),
      });
      if (route) {
        const allowedRoute = await RouteRole.find({
          routeId: route._id,
          roleId: { $in: rolesOfUser },
          isActive: true,
          isDeleted: false,
        });
        if (allowedRoute && allowedRoute.length) {
          next();
        } else {
          return res.unAuthorizedRequest('You are not having permission to access this route!');
        }
      } else {
        next();
      }
    } else {
      // return res.unAuthorizedRequest('You are not having permission to access this route!');
      next();
    }
  } else {
    return res.unAuthorizedRequest('Authorization token required!');
  }
  return undefined;
};

module.exports = checkRolePermission;
