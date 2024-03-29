const express = require('express');
var router = express.Router();
const cors = require('cors');

////////////////////////////////// MONGO DB OVERHEAD /////////////////////////////////////////////////
const mongoose = require('mongoose')
const User = require("./userSchemaMongo")
const Console = require("console"); //import that model created in userSchemaMongo.js

mongoose.connect("mongodb+srv://jesseC:mongo4999@cluster0.kva1ucs.mongodb.net/?retryWrites=true&w=majority",
    ()=> {
      console.log("connected successfully")
    },
    e=> console.error(e)
)
////////////////////////////////////////////////////////////////////////////////////END MONGO DB OVERHEAD


////////////////////////////////// MONGO HELPER FUNCTIONS /////////////////////////////////////////////////
// async function getFoodsByEmail(userEmail){
//   //get the user object
//   const userFound=await getUserObjectByEmail(userEmail);
//   if(userFound!==false){
//     console.log("food good");
//     // for(let i=0; i<userFound.foods.length; i++){
//     //     console.log(userFound.foods[i]);
//     // }
//     return userFound.foods;
//
//   }else{
//     console.log("food NOT good");
//   }
// }

async function getUserObjectByEmail(email) {
  const userFound = await User.findOne({email: email});
  if(!userFound){
    return false;
  }else{
    return userFound;
  }
}

async function checkIfUserExists(email){
  const userFound = await User.findOne({email: email});
  if (userFound) {
    return true;
  } else {
    return false;
  }
}
async function checkIfFoodExists(email, foodNameToFind){
    const userFound=await getUserObjectByEmail(email);
    if(userFound!==false){
      for(let i=0; i<userFound.foods.length; i++){
        if(userFound.foods[i].name!==null&&userFound.foods[i].name===foodNameToFind){
          return true;
        }
      }
      return false;
    }else{
      return false;
    }
}

async function checkIfDateExists(email, dateToFind){
  const userFound=await getUserObjectByEmail(email);
  if(userFound!==false){
    for(let i=0; i<userFound.days.length; i++){
      if(userFound.days[i].Day.toString()===dateToFind.toString()){
        return true;
      }
    }
  }
  return false;
}

async function getOneDate(email, dateToFind){
  const userFound=await getUserObjectByEmail(email);
  if(userFound!==false){
    for(let i=0; i<userFound.days.length; i++){
      if(userFound.days[i].Day.toString()===dateToFind.toString()){
        return userFound.days[i].Day.toString();
      }
    }
  }
  return false;
}
//////////////////////////////////////////////////////////////////////////////////END MONGO HELPER FUNCTIONS



////////////////////////////////// POST ROUTE HANDLERS ///////////////////////////////////////


router.post('/api/getAllFoods',cors(), async (req, res) => {
  if (await checkIfUserExists(req.body.email)) {
      const user = await getUserObjectByEmail(req.body.email);
      res.send(user.foods);
  }else{
    res.send(false);
  }

})

router.post('/api/getAllActivities',cors(), async (req, res) => {
  if (await checkIfUserExists(req.body.email)) {
    const user = await getUserObjectByEmail(req.body.email);
    res.send(user.activities);
  } else {
    res.send("error code something");
  }
})

router.get('/api/getAllDays',cors(), async (req, res) => {
  if (await checkIfUserExists(req.body.email)) {
    const user = await getUserObjectByEmail(req.body.email);
    res.send(user.days);
  } else {
    res.send(false);
  }
})

router.post('/api/getOneDay',cors(), async (req, res) => {
  console.log();
  console.log();
  console.log("looking for = "+req.body.day);
  console.log("emial is :"+req.body.email)
  const dateToFind = req.body.day
  if (await checkIfUserExists(req.body.email)) {
    const userFound = await getUserObjectByEmail(req.body.email);

//check if the date already exists
    for(let i=0; i<userFound.days.length; i++){
      const userDate=userFound.days[i].Day;
      console.log("currently in loop: "+userDate);
      if(userDate!==null&&userDate===dateToFind){
        console.log("$$$$$its a match! we found= "+userDate)
        //console.log("we found= "+userFound.days[i].Day.toString())
        //return userFound.days[i].Day.toString();
        res.send(userFound.days[i])
        return
      }
    }

    //if the date does not already exist, then we can add it, and return the newly created date entry
    console.log("COULD NOT FIND THAT DATE")
    res.send(false);

      //res.send(getOneDate(req.body.email, req.body.day))

  } else {
    res.send(false);
  }
})

router.post('/api/getRangeOfDays',cors(), async (req, res) => {
  const startDay = req.body.startDay
  const endDay = req.body.endDay
  console.log();
  console.log();
  console.log("looking for days from["+startDay+"] and ["+endDay+"]");
  console.log("email is :"+req.body.email)

  if (await checkIfUserExists(req.body.email)) {
    const userFound = await getUserObjectByEmail(req.body.email);

//check if the date already exists
    for(let i=0; i<userFound.days.length; i++){
      const userDate=userFound.days[i].Day;
      console.log("currently in loop: "+userDate);
      if(userDate!==null&&userDate===startDay){
        console.log("$$$$$its a match! we found= "+userDate)
          const daysArrayToReturn=[];
          //daysArrayToReturn.push(userDate);
          for(let j=i; j<userFound.days.length; j++){
            const nextDate=userFound.days[j].Day;
            if(userDate!==null&&userDate!==endDay){
              daysArrayToReturn.push(nextDate);
            }
          }
        res.send(daysArrayToReturn)//todo: return the right array
        return
      }
    }
    //if the date does not already exist, then we can add it, and return the newly created date entry
    console.log("COULD NOT FIND THAT DATE")
    res.send(false);

    //res.send(getOneDate(req.body.email, req.body.day))

  } else {
    res.send(false);
  }
})



//INSERT A NEW DATE OR UPDATE IF EXISTING ////////////////////////////////
router.post('/api/insertNewDay', async (req, res) => {
  if (await insertDay(req.body.email, req.body.days)) {
    res.send(true);
  } else {
    res.send(false);
  }
});

async function insertDay(userEmail, newDayObject){
  const userFound=await getUserObjectByEmail(userEmail);
  const newDate=newDayObject.Day;
  if(userFound!==false){
    for(let i=0; i<userFound.days.length; i++){
      const userDate=userFound.days[i].Day;
      if(userDate!==null&&userDate===newDate){
        userFound.days[i].caloriesIn+=newDayObject.caloriesIn;
        userFound.days[i].caloriesOut+=newDayObject.caloriesOut;
        await userFound.save();
        return true;
      }
    }
    userFound.days.push(newDayObject);
    await userFound.save();
    return true;
  }else{
    return false;
  }
}
//////////////////////////////////////////////////

//INSERT A NEW FOOD  /////////////////////////////////
router.post('/api/insertNewFood', async (req, res) => {
  if (await insertFood(req.body.email, req.body.foodToAdd)) {
    res.send(true);
  } else {
    res.send(false);
  }
});

async function insertFood(userEmail, newFoodObject){
  const userFound=await getUserObjectByEmail(userEmail);
  if(userFound!==false){
    for(let i=0; i<userFound.foods.length; i++){
      if(userFound.foods[i].name!==null&&userFound.foods[i].name===newFoodObject.name){
        userFound.foods[i].name=newFoodObject.name;
        userFound.foods[i].calories=newFoodObject.calories;
        userFound.foods[i].imageUrl="https://s3forninad.s3.amazonaws.com/food+photos/defaultFoodStockPhoto.jpg";
        await userFound.save();
        return true;
      }
    }
    newFoodObject.imageUrl="https://s3forninad.s3.amazonaws.com/food+photos/defaultFoodStockPhoto.jpg";
    userFound.foods.push(newFoodObject);
    await userFound.save();
    return true;
  }else{
    return false;
  }
}
/////////////////////////////////



//INSERT A NEW ACTIVITY  /////////////////////////////////
router.post('/api/insertNewActivity', async (req, res) => {
  if (await insertActivity(req.body.email, req.body.activityToAdd)) {
    res.send(true);
  } else {
    res.send(false);
  }
});

async function insertActivity(userEmail, newActivityObject){
  const userFound=await getUserObjectByEmail(userEmail);
  if(userFound!==false){
    for(let i=0; i<userFound.activities.length; i++){
      if(userFound.activities[i].name!==null&&userFound.activities[i].name===newActivityObject.name){
        userFound.activities[i].name=newActivityObject.name;
        userFound.activities[i].calories=newActivityObject.calories;
        userFound.activities[i].imageUrl="https://s3forninad.s3.amazonaws.com/excercise+photos/excerciseStockPhoto.jpg";
        await userFound.save();
        return true;
      }
    }
    newActivityObject.imageUrl="https://s3forninad.s3.amazonaws.com/excercise+photos/excerciseStockPhoto.jpg";
    userFound.activities.push(newActivityObject);
    await userFound.save();
    return true;
  }else{
    return false;
  }
}
/////////////////////////////////




// ADD A NEW USER /////////////////////////////////
router.post('/api/addUser', async (req, res) => {
  const userEmailToAdd = req.body.email;
  const userExists = await checkIfUserExists(userEmailToAdd);
  if (!userExists) {
    createNewUser(userEmailToAdd).then(r => {
      res.send("successfully added user: " + userEmailToAdd);
    });
  } else {
    res.send("user already exists");
  }


});

//CURRENTLY AUTO POPULATES NEW USERS WITH DATA FOR DEMO PURPOSES
async function createNewUser(emailToUse) {
  let date = new Date()
  date.setMilliseconds(0);
  date.setSeconds(0);
  date.setMinutes(0);
  date.setHours(0);
  const user = await User.create(
      {
        email: emailToUse,
        activities:[
          {name: 'running', calories: 100, imageUrl:"https://s3forninad.s3.amazonaws.com/excercise+photos/running.jpg"},
          {name: 'yoga', calories: 70, imageUrl: "https://s3forninad.s3.amazonaws.com/excercise+photos/yoga.jpg"},
          {name: 'swimming', calories: 300, imageUrl: "https://s3forninad.s3.amazonaws.com/excercise+photos/swimming.png"}
        ],
        days:[
          {Day: date, caloriesIn: 9001, caloriesOut: 1},
          {Day: date, caloriesIn: 9002, caloriesOut: 2}
        ],
        foods:[
          {name: 'pizza', calories: 400, imageUrl: "https://s3forninad.s3.amazonaws.com/food+photos/pizza.jpg"},
          {name: 'salad', calories: 120, imageUrl: "https://s3forninad.s3.amazonaws.com/food+photos/salad.jpg"},
          {name: 'icecream', calories: 500, imageUrl: "https://s3forninad.s3.amazonaws.com/food+photos/icecream.jpg"},
        ]
      }
  )
}
/////////////////////////////////




/////////////////////////////////////////////////////////////////////////END POST ROUTE HANDLERS



//puts are not necessary for our user stories, but the template has been left in
////////////////////////////////// PUT ROUTE HANDLERS ///////////////////////////////////////

//UPDATE AN EXISTING FOOD  /////////////////////////////////
router.put('/api/updateExistingFood', async (req, res) => {
  if (await updateFood(req.body.email, req.body.foodToUpdate, req.body.newFoodInfo)) {
    res.send(true);
  } else {
    res.send(false);
  }
});

async function updateFood(userEmail, foodToUpdate, newFoodObject){
  if(await checkIfUserExists(userEmail)){
    const userFound=await getUserObjectByEmail(userEmail);
    for(let i=0; i<userFound.foods.length; i++){
      if(userFound.foods[i].name===foodToUpdate){
        userFound.foods[i]=newFoodObject;
        await userFound.save();
        return true;
      }
    }
  }else{
    return false;
  }
}
/////////////////////////////////



/////////////////////////// DELETE ROUTE HANDLERS ////////////////////////////////////


///////////////////////////DELETE A PARTICULAR USER //////////////////////////////////////////////
router.delete('/api/deleteUser', async (req, res) => {
  const emailToDelete = req.body.email;
  const userExists = await checkIfUserExists(emailToDelete);
  if (userExists) {
    deleteByEmail(emailToDelete).then(r => {
      res.send("successfully deleted: " + emailToDelete);
    });
  } else {
    res.send("failed to delete: " + emailToDelete+" does not exist");
  }
});

async function deleteByEmail(emailToDelete) {
  await User.deleteOne({email: emailToDelete}, function (err, docs){
    if (err){
    }
    else{
    }
  }).clone();
}
/////////////////////////////////////////////


///////////////////////////DELETE A PARTICULAR DAY //////////////////////////////////////////////
router.delete('/api/deleteDay', async (req, res) => {
  if (await deleteDay(req.body.email, req.body.days)) {
    res.send(true);
  } else {
    res.send(false);
  }
});

async function deleteDay(userEmail, newDayObject){
  const userFound=await getUserObjectByEmail(userEmail);
  const newDate=Date.parse(newDayObject.Day);
  if(userFound!==false){
    for(let i=0; i<userFound.days.length; i++){
      const userDate=Date.parse(userFound.days[i].Day);
      if(userDate!==null&&userDate===newDate){
        userFound.days.splice(i, 1);
        await userFound.save();
        return true;
      }
    }
    return false;
  }else{
    return false;
  }
}
/////////////////////////////////////////////

///////////////////////////DELETE A PARTICULAR FOOD  //////////////////////////////////////////////
router.delete('/api/deleteFood', async (req, res) => {
  if (await deleteFood(req.body.email, req.body.foodToDelete)) {
    res.send(true);
  } else {
    res.send(false);
  }
});

async function deleteFood(userEmail, foodToDelete){
  if(await checkIfUserExists(userEmail)){
    const userFound=await getUserObjectByEmail(userEmail);
    for(let i=0; i<userFound.foods.length; i++){
      if(userFound.foods[i].name===foodToDelete){
        //Console.log("!!!FOOD EXISTS!!!")
        //todo: may not even need the loop, just use index of
        userFound.foods.splice(i,1);
        await userFound.save();
        return true;
      }
    }
  }else{
    return false;
  }
}

///////////////////////////DELETE A PARTICULAR ACTIVITY  //////////////////////////////////////////////
router.delete('/api/deleteActivity', async (req, res) => {
  if (await deleteActivity(req.body.email, req.body.activityToDelete)) {
    res.send(true);
  } else {
    res.send(false);
  }
});

async function deleteActivity(userEmail, activityToDelete){
  if(await checkIfUserExists(userEmail)){
    const userFound=await getUserObjectByEmail(userEmail);
    for(let i=0; i<userFound.activities.length; i++){
      if(userFound.activities[i].name===activityToDelete){
        //todo: may not even need the loop, just use index of
        userFound.activities.splice(i,1);
        await userFound.save();
        return true;
      }
    }
  }else{
    return false;
  }
}
/////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////END DELETE ROUTE HANDLERS

module.exports = router;
