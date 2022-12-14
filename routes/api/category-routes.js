const router = require('express').Router();
const sequelize = require('sequelize');
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  try{
    const categories = await Category.findAll({
      include: [{model: Product}],
      attributes: {
        include: [
          [
            sequelize.literal(`(SELECT COUNT(id) FROM category)`),
            `num_of_categories`
          ]
        ]
      }
      
    })

    res.json(categories);

  } catch (err){
    console.log(err);
    res.status(500).json(err);
  }
  // be sure to include its associated Products
});

router.get('/:id', async (req, res) => {
  let id = req.params.id;
  // find one category by its `id` value
  try {
    let idData = await Category.findByPk(id, {
      include: [{ model: Product }]
    })


    if(idData){
      res.json(idData)
    } else {
      res.status(400).json({errorMessage: 'Invalid request'})
    }

  } catch(err) {
    res.status(500).json(err);
  }
  // be sure to include its associated Products
});

router.post('/', async (req, res) => {
  // create a new category
  try {
    let newCategory = await Category.create(req.body)

    res.json(newCategory)
  } catch(err) {
    res.json(err);
  }
});

router.put('/:id', async (req, res) => {
  // update a category by its `id` value
  try{
    let updatedCategory = await Category.update(req.body, {
      where: {
        id: req.params.id
      }
    })
    res.json({"action": "updated", "content": req.body, "fields": updatedCategory})
  

  } catch(err) {
    res.status(500).json(err);
  }

});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try{
    let deletedProducts = await Product.destroy({
      where: {
        category_id: req.params.id
      }
    })
    console.log(deletedProducts);
    let deletedCategory = await Category.destroy({
      where: {
        id: req.params.id
      }
    })
    console.log(deletedCategory);
    res.json({"action": "deleted", "item": req.params.id, "fields": deletedCategory})

  } catch(err){
    res.status(500).json(err);
    console.log(err);
  }
});

module.exports = router;
