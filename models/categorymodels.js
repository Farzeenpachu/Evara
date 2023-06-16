const mongoose=require('mongoose')
const schema=mongoose.Schema

const categorySchema = new schema(
    {
      name: {
        type: String,
        required: true,
        validate: {
          validator: async function (name) {
            const categoryName = await this.constructor.findOne({
              name: { $regex: new RegExp(`^${name}$`, 'i') },
            });
            return !categoryName;
          },
          message: 'Category name must be unique.',
        },
      },
      status: {
        type: Boolean,
        default: true,
      },
    },
    { collation: { locale: 'en', strength: 2 } }
  );
// const categorySchema = new schema({
//     name: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     status: {
//       type: Boolean,
//       default: true,
//     },
//   });
  

const category=mongoose.model('Category',categorySchema)
module.exports=category