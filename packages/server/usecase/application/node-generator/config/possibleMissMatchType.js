const possibleTypesMissMatch = [
  {
    type: ['tpe', 'typ', 'tye', 'types', 'typs', 'Type'],
    ref: ['rf', 'reff', 're', 'references', 'reference', 'ef', 'Ref'],
    index: ['indx', 'inde', 'dex', 'ind', 'indexs', 'indexes', 'Index', 'Indexs', 'Indexes', 'Indexx', 'indexx', 'in', 'idex'],
    unique: ['uniq', 'unquie', 'uniqs', 'uniques', 'Uniwue', 'Unique', 'uniqus', 'un', 'nique'],
    alias: ['alas', 'alis', 'Alias', 'lias', 'slias', 'alas', 'alia'],
    default: ['defult', 'defualt', 'efault', 'def', 'Default', 'deault', 'deflt', 'sefault',
      'dealt', 'deful', 'defaul', 'defu', 'fefault', 'DEFAULT'],
    lowercase: ['lower case', 'loercase', 'lowerCase', 'LowerCase', 'LOWERCASE', 'lowervase', 'loercase', 'lowecase',
      'lorcase', 'lcase', 'Lower', 'lower'],
    trim: ['trm', 'tri', 'rim', 'Trim', 'tirmmed', 'TRIM', 'trem', 'trum', 'tim', 'tr'],
    enum: ['enm', 'Enum', 'enums', 'num', 'en', 'nums', 'ENUM'],
    required: ['req', 'rewuired', 'requred', 'requrid', 'Required', 'REQUIRED', 'require', 'Require', 'requird', 'requrf', 'requrief'],
    validate: ['Validate', 'VALIDATE', 'Val', 'val', 'lidate', 'vlidate', 'valid', 'Valid', 'VALID', 'vlid', 'valisate', 'valis', 'Valis', 'vldate'],
    get: ['gets', 'gt', 'GET', 'Get', 'Fet', 'fet', 'det', 'gwt', 'Gwt', 'gett', 'ge', 'gte', 'geet'],
    set: ['sets', 'st', 'SET', 'Set', 'Aet', 'aet', 'det', 'swt', 'Swt', 'sett', 'se', 'ste', 'seet'],
    immutable: ['immtable', 'imutable', 'imtbl', 'imutble', 'immmutable', 'immutble', 'immuttablke', 'immutablke', 'Immutable', 'IMMUTABLE', 'imutbl'],
    sparse: ['spars', 'sprde', 'sprse', 'Sparse', 'spres', 'sparde', 'Sparse', 'SPARSE', 'sprs', 'sparsee', 'sppase', 'spparse'],
    transform: ['trans', 'trabnsfom', 'transfom', 'Transform', 'TRANSFORM', 'trnadorm', 'transorm', 'trsnsform', 'trensform'],
    match: ['MAtch', 'matchh', 'atch', 'metch', 'mstch', 'Match', 'MATCH', 'matc', 'mAtch', 'mtch'],
    minLength: ['minlenghts', 'minlength', 'min length', 'MInlenght', 'MinLength', 'MINLENGTH', 'mins length', 'mins', 'min-length',
      'Min-Lenght', 'minlengtth', 'minlenght', 'lengthMin', 'legth', 'lenght'],
    maxLength: ['maxlenghts', 'maxLenght', 'maxlength', 'max length', 'MAxlenght', 'MaxLength', 'MAXLENGTH', 'mazLength', 'maxz', 'max-length',
      'Max-Lenght', 'maxlengtth', 'maxlength', 'lengthMax', 'legth', 'lenght'],
    populate: ['pop', 'populte', 'Popouate', 'popuate', 'poluate', 'populyte', 'polate', 'poplate', 'polute', 'populates', 'PoPulate'],
    min: ['mins', 'mi', 'nin', 'mun', 'mon', 'minn', 'MIn', 'MIN', 'Min'],
    max: ['maxz', 'ma', 'maz', 'mxx', 'msx', 'maxx', 'MAx', 'MAX', 'Max'],
    of: ['OF', 'Of', 'off', 'OFF', 'if', 'If', 'Ofs'],
  },
];
module.exports = {
  // eslint-disable-next-line consistent-return
  getCorrectName (params) {
    for (let index = 0; index < possibleTypesMissMatch.length; index += 1) {
      const element = possibleTypesMissMatch[index];
      const keywords = Object.keys(possibleTypesMissMatch[index]);
      for (let j = 0; j < keywords.length; j += 1) {
        const val = keywords[j];
        if (element[val].includes(params)) {
          return val;
        }
      }
    }
  },
};
