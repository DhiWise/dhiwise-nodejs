/* eslint-disable no-plusplus ,no-await-in-loop , no-unused-expressions ,class-methods-use-this ,no-return-await */
/* global  _ */
require('dotenv').config({ path: './variables.env' });
const ObjectId = require('mongodb').ObjectID;
const mongoose = require('mongoose');
/*  */

class MongoAtlasRepository {
  constructor (model) {
    this.model = mongoose.model(model.MODEL_NAME);
  }

  /*
   *
   * Function used to create conditional criteria.
   *
   * `key` = DB collection column name.
   * `val` = value
   *
   *
   * find : { "find" : { key : val } }
   * $in :  { "in" : [ { key : val(Array) } ] }
   * $nin :  { "nin" : [ { key : val(Array) } ] }
   * $ne :  { "ne" : [ { key : val } ] }
   * populate : { "populate" : [ { "{relationName | relationKey}" : fields(Array) | null } ] }
   * $lt(e) : { "lt" : [ { key : val } ] }
   * $gt(e) : { "gt" : [ { key : val } ] }
   * between : { "between" : [ { key : [lt_value, gt_value] } ] }
   * between_eq : { "between_eq" : [ { key : [lt_value, gt_value] } ] }
   *
   *
   * @param  {} filter
   */
  async prepareQuery (filter) {
    let criteria = {};

    // Prepare conditions for `search`.
    if (filter && filter.search && filter.search.keys && filter.search.keyword) {
      const searchData = [];
      const keyword = new RegExp(filter.search.keyword, 'i');
      filter.search.keys.forEach((value) => {
        const data = {};
        data[value] = keyword;
        searchData.push(data);
      });

      if (filter?.or) {
        filter.or = [...filter.or, ...searchData];
      } else {
        criteria = _.extend(criteria, { $or: searchData });
      }
    }

    // Prepare conditions for `multiple search`.
    if (filter && filter.multipleSearch && filter.multipleSearch.keys && filter.multipleSearch.keywords) {
      const searchData = [];
      _.map(filter.multipleSearch.keys, (fieldKey) => {
        _.map(filter.multipleSearch.keywords, (val) => {
          const sObj = {};
          sObj[fieldKey] = new RegExp(val, 'i');
          searchData.push(sObj);
        });
      });

      if (filter?.or) {
        filter.or = [...filter.or, ...searchData];
      } else {
        criteria = _.extend(criteria, { $or: searchData });
      }
    }

    // Prepare conditions for `find`.
    if (filter && filter.find) {
      criteria = _.extend(criteria, filter.find);
    }

    // Prepare conditions for `$in`.
    if (filter && filter.in) {
      filter.in.forEach((value) => {
        Object.keys(value).forEach((key) => {
          /*
           * criteria[key] = {
           *          "$in": value[key]
           *        }
           */
          criteria[key] = _.extend(criteria[key], { $in: value[key] });
        });
      });
    }

    // Prepare conditions for `$or`.
    if (filter && filter.or) {
      // criteria = _.extend(criteria.$or, filter.or);
      criteria = _.extend(criteria, { $or: filter.or });
    }
    // Prepare conditions for `$nin`.
    if (filter && filter.nin) {
      filter.nin.forEach((value) => {
        Object.keys(value).forEach((key) => {
          /*
           * criteria[key] = {
           *          "$nin": value[key]
           *        }
           */
          criteria[key] = _.extend(criteria[key], { $nin: value[key] });
        });
      });
    }

    // Prepare conditions for `$ne`.
    if (filter && filter.ne) {
      filter.ne.forEach((value) => {
        Object.keys(value).forEach((key) => {
          /*
           * criteria[key] = {
           *          "$ne": value[key]
           *        }
           */
          criteria[key] = _.extend(criteria[key], { $ne: value[key] });
        });
      });
    }

    // Prepare conditions for `$lt`.
    if (filter && filter.lt) {
      filter.lt.forEach((value) => {
        Object.keys(value).forEach((key) => {
          /*
           * criteria[key] = {
           *          "$lt": value[key]
           *        }
           */
          criteria[key] = _.extend(criteria[key], { $lt: value[key] });
        });
      });
    }

    // Prepare conditions for `$gt`.
    if (filter && filter.gt) {
      filter.gt.forEach((value) => {
        Object.keys(value).forEach((key) => {
          /*
           * criteria[key] = {
           *          "$gt": value[key]
           *        }
           */
          criteria[key] = _.extend(criteria[key], { $gt: value[key] });
        });
      });
    }

    // Prepare conditions for `$lte`.
    if (filter && filter.lte) {
      filter.lte.forEach((value) => {
        Object.keys(value).forEach((key) => {
          /*
           * criteria[key] = {
           *          "$lte": value[key]
           *        }
           */
          criteria[key] = _.extend(criteria[key], { $lte: value[key] });
        });
      });
    }

    // Prepare conditions for `$gte`.
    if (filter && filter.gte) {
      filter.gte.forEach((value) => {
        Object.keys(value).forEach((key) => {
          /*
           * criteria[key] = {
           *          "$gte": value[key]
           *        }
           */
          criteria[key] = _.extend(criteria[key], { $gte: value[key] });
        });
      });
    }

    // Prepare conditions for `between`.
    if (filter && filter.between) {
      filter.between.forEach((value) => {
        Object.keys(value).forEach((key) => {
          /*
           * criteria[key] = {
           *          "$gt": value[key][0],
           *          "$lt": value[key][1]
           *        }
           */
          criteria[key] = _.extend(criteria[key], {
            $gt: value[key][0],
            $lt: value[key][1],
          });
        });
      });
    }

    // Prepare conditions for `between_eq`.
    if (filter && filter.between_eq) {
      filter.between_eq.forEach((value) => {
        Object.keys(value).forEach((key) => {
          /*
           * criteria[key] = {
           *          "$gte": value[key][0],
           *          "$lte": value[key][1]
           *        }
           */
          criteria[key] = _.extend(criteria[key], {
            $gte: value[key][0],
            $lte: value[key][1],
          });
        });
      });
    }

    // if in criteria no isDeleted , isActive then set default
    if (!_.has(criteria, 'isDeleted')) {
      criteria.isDeleted = false;
    }
    if (!_.has(criteria, 'isActive')) {
      criteria.isActive = true;
    }
    if (_.has(criteria, 'isActiveDeactivateDisplay')) {
      criteria.isActive = { $in: [true, false] };
    }
    // Prepare `pagination`.
    const paginate = await this.managePagination(filter);

    // Prepare `orderBy`
    const sortBy = await this.manageOrderBy(filter);

    // Prepare `populate`.
    const populate = await this.managePopulate(filter);

    const query = {

      criteria,
      populate,
      paginate,
      sortBy,
    };
    return query;
  }

  /**
   *
   * Function used to manage order by.
   *
   * @param  {} filter
   */
  async manageOrderBy (filter) {
    let sort = { createdAt: -1 };

    if (filter && filter.sortBy) {
      Object.keys(filter.sortBy).forEach((val) => {
        if (filter.sortBy[val] === 'ASC' || filter.sortBy[val] === 'asc') {
          filter.sortBy[val] = 1;
        } else if (filter.sortBy[val] === 'DESC' || filter.sortBy[val] === 'desc') {
          filter.sortBy[val] = -1;
        }
      });

      sort = filter.sortBy;
    }

    return sort;
  }

  /**
   * @param  {} filter
   */
  async managePagination (filter) {
    const paginate = {
      page: 0,
      limit: 0,
    };

    if (filter && filter.page && filter.limit) {
      paginate.page = ((filter.page * filter.limit) - filter.limit);
      paginate.limit = filter.limit;
    } else {
      if (filter.skip) {
        paginate.page = filter.skip;
      }
      if (filter.limit) {
        paginate.limit = filter.limit;
      }
    }

    return paginate;
  }

  /**
   *
   * Function used to manage populate data.
   *
   * `path` = relation name
   * `select` = fields to be given
   *
   * @param  {} filter
   */
  async managePopulate (filter) {
    const populates = [];
    if (filter && filter.populate) {
      const modelInstance = {};

      let nestedModelInstance = [];
      _.forEach(filter.populate, (val) => {
        Object.keys(val).forEach((j) => {
          const letInstance = _.without(_.map(val[j], 'model'), undefined);
          if (letInstance && _.size(letInstance) > 0) {
            nestedModelInstance.push(letInstance);
          }

          if (Array.isArray(val[j])) {
            _.forEach(val[j], (i) => {
              if (typeof i === 'object') {
                Object.keys(i).forEach((k) => {
                  const letInstance2 = _.without(_.map(i[k], 'model'), undefined);
                  if (letInstance2 && _.size(letInstance2) > 0) {
                    nestedModelInstance.push(letInstance2);
                  }
                });
              }
            });
          }
        });
      });
      nestedModelInstance = _.flatten(nestedModelInstance);

      let crossDbPopulate = _.without(_.map(filter.populate, 'model'), undefined);
      crossDbPopulate = _.uniq([...nestedModelInstance, ...crossDbPopulate]);

      for (let index = 0; index < crossDbPopulate.length; index++) {
        const mInstance = await this.crossDBConnect(crossDbPopulate[index]);
        modelInstance[crossDbPopulate[index]] = mInstance;
      }

      filter.populate.forEach((value) => {
        let populateData = {};

        if (value.model) {
          Object.keys(value).forEach(async (key) => {
            if (key !== 'model' && key !== 'match') {
              // =======================  Cross DB in populate  =================================
              const selectFields = [];
              let fPopulate = null;
              value[key].forEach((dt) => {
                if (_.isObject(dt)) {
                  Object.keys(dt).forEach(async (k1) => {
                    if (k1 !== 'model' && k1 !== 'match') {
                      const nestedSelectFields = [];
                      let nestedFPopulate = [];
                      dt[k1].forEach((dts) => {
                        if (_.isObject(dts)) {
                          Object.keys(dts).forEach(async (k2) => {
                            if (k2 !== 'model' && k2 !== 'match') {
                              nestedFPopulate = {
                                path: k2,
                                select: _.filter(dts[k2], (o) => {
                                  if (typeof o === 'string') return o;
                                  return false;
                                }).join(' '),
                                model: dts.model,
                                match: dts.match,
                              };
                            }
                          });
                        } else {
                          nestedSelectFields.push(dts);
                        }
                      });

                      fPopulate = {
                        path: k1,
                        select: nestedSelectFields,
                        model: dt.model,
                        match: dt.match,
                        populate: nestedFPopulate,
                      };
                    }
                  });
                } else {
                  selectFields.push(dt);
                }
              });

              populateData = {
                path: key,
                select: selectFields ? selectFields.join(' ') : null,
                model: modelInstance[value.model],
                match: value.match,
                populate: fPopulate,
              };
            }

            if (populateData && Object.keys(populateData).length > 1) {
              populates.push(populateData);
            }
          });
        } else {
          Object.keys(value).forEach(async (key) => {
            let isNestedPopulate = false;
            _.map(value[key], (val) => {
              if (_.isObject(val)) {
                isNestedPopulate = true;
              }
            });

            // Nested Populate Logic
            if (isNestedPopulate === true) {
              const parentSelectKeys = _.filter(value[key], (o) => _.isString(o));

              const populateLevel1Array = [];

              _.forEach(value[key], (pl1Values) => {
                if (_.isObject(pl1Values)) {
                  _.forEach(pl1Values, (pl1Value, pl1Key) => {
                    const tempPopulate = {};

                    const populateLevel1SelectKeys = _.filter(pl1Value, (o) => _.isString(o));

                    if (pl1Key !== 'model' && pl1Key !== 'match') {
                      tempPopulate.path = pl1Key;
                      tempPopulate.select = populateLevel1SelectKeys ? populateLevel1SelectKeys.join(' ') : null;
                      tempPopulate.match = pl1Values.match;
                      tempPopulate.model = modelInstance[pl1Values.model];
                    }

                    // Add Second level population
                    const populateLevel2Array = [];
                    if (pl1Key !== 'match') {
                      _.forEach(pl1Value, (pl1v) => {
                        if (_.isObject(pl1v)) {
                          _.map(pl1v, (pl2Value, pl2Key) => {
                            const tempPopulate2 = {};

                            const populateLevel2SelectKeys = _.filter(pl2Value, (o) => _.isString(o));

                            if (pl2Key !== 'model' && pl2Key !== 'match') {
                              tempPopulate2.path = pl2Key;
                              tempPopulate2.select = populateLevel2SelectKeys ? populateLevel2SelectKeys.join(' ') : null;
                              tempPopulate2.match = pl1v.match;
                              tempPopulate2.model = modelInstance[pl1v.model];
                            }

                            if (tempPopulate2 && Object.keys(tempPopulate2).length > 0) {
                              populateLevel2Array.push(tempPopulate2);
                            }
                          });
                        }
                      });
                    }

                    if (_.isEmpty(populateLevel2Array) === false) {
                      tempPopulate.populate = populateLevel2Array;
                    }

                    if (tempPopulate && Object.keys(tempPopulate).length > 0) {
                      populateLevel1Array.push(tempPopulate);
                    }
                  });
                }
              });

              populateData = {
                path: key,
                select: parentSelectKeys ? parentSelectKeys.join(' ') : null,
                match: value.match,
              };
              if (_.isEmpty(populateLevel1Array) === false) {
                populateData = _.extend(populateData, { populate: populateLevel1Array });
              }

              /*
               * let parentSelectKeys = _.filter(value[key], function (o) { return _.isString(o); });
               *
               *            let populateLevel1Array = [];
               *
               *            _.forEach(value[key], function (pl1Values) {
               *
               *              if (_.isObject(pl1Values)) {
               *
               *                _.forEach(pl1Values, function (pl1Value, pl1Key) {
               *
               *                  let tempPopulate = {};
               *
               *                  let populateLevel1SelectKeys = _.filter(pl1Value, function (o) { return _.isString(o); });
               *
               *                  tempPopulate.path = pl1Key;
               *                  tempPopulate.select = populateLevel1SelectKeys ? populateLevel1SelectKeys.join(" ") : null
               *
               *                  //Add Second level population
               *                  let populateLevel2Array = [];
               *                  _.forEach(pl1Value, function (pl1v) {
               *                    if (_.isObject(pl1v)) {
               *                      _.map(pl1v, function (pl2Value, pl2Key) {
               *                        let tempPopulate2 = {};
               *
               *                        let populateLevel2SelectKeys = _.filter(pl2Value, function (o) { return _.isString(o); });
               *                        tempPopulate2.path = pl2Key;
               *                        tempPopulate2.select = populateLevel2SelectKeys ? populateLevel2SelectKeys.join(" ") : null
               *
               *                        populateLevel2Array.push(tempPopulate2);
               *
               *                      });
               *                    }
               *                  });
               *                  if (_.isEmpty(populateLevel2Array) === false) {
               *                    tempPopulate.populate = populateLevel2Array;
               *                  }
               *                  populateLevel1Array.push(tempPopulate);
               *                });
               *              }
               *            });
               *            populateData = {
               *              path: key,
               *              select: parentSelectKeys ? parentSelectKeys.join(" ") : null
               *            }
               *            if (_.isEmpty(populateLevel1Array) === false) {
               *              populateData = _.extend(populateData, { populate: populateLevel1Array })
               *            }
               */
            } else if (key && key !== 'match') {
              populateData = {
                path: key,
                select: value[key] ? value[key]?.join(' ') : null,
                match: value.match,
              };
            }
          });
          populates.push(populateData);
        }
      });
    }

    return populates;
  }

  // Basic CRUD
  /**
   *
   * Function used to create.
   *
   * @param  {} insertData
   */
  async create (insertData) {
    const result = await this.model.create(insertData);
    return result;
  }

  /**
   *
   * Function used to delete data.
   *
   * @param  {} id
   */
  async deleteById (id) {
    const filter = { _id: ObjectId(id) };
    const result = await this.model.deleteOne(filter);
    return result;
  }

  /**
   *
   * Function used to get data by Id.
   *
   * @param  {} options {id,fields}
   */
  async getById (options) {
    const filter = {
      _id: ObjectId(options.id),
      isDeleted: false,
      isActive: true,
    };
    const fields = options.fields ? options.fields.join(' ') : null;
    const result = await this.model.findOne(filter, fields);
    return result;
  }

  async insertMany (data) {
    const result = await this.model.insertMany(data);
    return result;
  }

  async getOne (options) {
    const fields = options.fields ? options.fields.join(' ') : null;
    let filterOptions = options;
    if (options.filter) {
      filterOptions = options.filter;
    }
    const query = await this.prepareQuery(filterOptions);
    const result = await this.model.findOne(query.criteria).select(fields)
      .populate(query.populate)
      .lean();
    return result;
  }

  /**
   *
   * Function used to update data by Id.
   *
   * @param  {} id
   * @param  {} data
   */
  async updateById (id, data) {
    const filter = { _id: ObjectId(id) };
    const result = await this.model.findByIdAndUpdate(filter, { $set: data }, {
      new: true,
      useFindAndModify: false,
    });
    return result;
  }

  /**
   *
   * Function used to update single document.
   *
   * @param  {} options
   * @param  {} data
   */
  async updateOne (options, data) {
    let filterOptions = options;
    if (options.filter) {
      filterOptions = options.filter;
    }
    const query = await this.prepareQuery(filterOptions);
    const result = await this.model.findOneAndUpdate(query.criteria, { $set: data }, {
      new: true,
      upsert: true,
    });
    return result;
  }

  async createOrUpdate (data, keys) {
    const query = {};
    keys.forEach((key) => {
      query[key] = data[key];
    });
    const result = await this.model.findOneAndUpdate(query, data, {
      new: true,
      upsert: true,
    });
    return result;
  }

  /**
   *
   * Function used to get details.
   *
   * @param  {} filter
   */
  async getDetails (filter) {
    const fields = (filter && filter.fields) ? filter.fields : '';
    const query = await this.prepareQuery(filter);
    const result = await this.model.find(query.criteria).select(fields)
      .populate(query.populate)
      .skip(query.paginate.page)
      .limit(query.paginate.limit)
      .sort(query.sortBy)
      .lean();
    return result;
  }

  async getAll (filter) {
    const result = await this.model.find({})
      .sort(filter);
    return result;
  }

  /**
   *
   * Function used to get count.
   *
   * @param  {} filter
   */
  async getCount (filter) {
    const query = await this.prepareQuery(filter);
    const result = await this.model.countDocuments(query.criteria);
    return result;
  }

  /**
   *
   * Function used to update multiple records.
   * @param  {} options
   */
  async updateMany (options) {
    let filterOptions = options;
    if (options.filter) {
      filterOptions = options.filter;
    }
    const query = await this.prepareQuery(filterOptions);
    const result = await this.model.updateMany(query.criteria, { $set: options.data }, { new: true });
    return result;
  }

  /**
   *
   * Function used to delete multiple records.
   *
   * @param  {} options
   */
  async deleteMany (filter) {
    const query = await this.prepareQuery(filter);
    const result = await this.model.deleteMany(query.criteria);
    return result;
  }

  /**
   *
   * Function used to execute aggregate query.
   * @param  {} options
   */
  async aggregate (options) {
    const result = await this.model.aggregate(options.queryStages);
    return result;
  }

  async deleteOne (filter) {
    const result = await this.model.deleteOne(filter);
    return result;
  }

  /**
   *
   * Function used to update multiple records with raw query.
   * @param  {} options
   */
  async rawUpdateMany (options) {
    const query = await this.prepareQuery(options.filter);
    const result = await this.model.updateMany(query.criteria, options.data, { new: true });
    return result;
  }
}
module.exports = MongoAtlasRepository;
