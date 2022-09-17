const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  try{
    let tagData = await Tag.findAll({
      include: [{model: Product}]
    });

    res.json(tagData);
  }catch (err){
    res.status(500).json(err)
  }
  // be sure to include its associated Product data
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  try{
    let oneTag = await Tag.findByPk(req.params.id, {
      include: [{model: Product}]
    })

    if(oneTag){
      res.json(oneTag)
    } else{
      res.status(400).json({errorMessage: "No data found"})
    }
  } catch(err) {
    res.status(500).json(err)
  }
  // be sure to include its associated Product data
});

router.post('/', async (req, res) => {
  // create a new tag
  try{
    let newTag = await Tag.create(req.body)

    res.json(newTag)
  } catch (err){
    res.status(500).json(err)
  }
});

router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value
  try{
    let findId = await Tag.findByPk(req.params.id)

    if(findId){
      let updateTag = await Tag.update(req.body, {
        where: {
          id: req.params.id
        }
      })
  
      if(updateTag){
        res.json(req.body)
      } else {
        res.json({
          errorMessage: 'Invalid update request'
        })
      }
    } else{
      res.status(400).json({
        errorMessage: "Invalid entry."
      })
    }

    

  } catch (err){
    res.status(500).json(err)
  }
});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  try{
    let findId = await Tag.findByPk(req.params.id)

    if(findId){
      let deletedTag = await Tag.destroy({
        where: {
          id: req.params.id
        }
      })
      res.json(deletedTag)
    } else {
      res.status(400).json({errorMessage: "Invalid entry"})
    }
    
  }catch(err){
    res.status(500).json(err)

  }
});

module.exports = router;
