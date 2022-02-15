var express = require('express');
var router = express.Router();
var db = require('../db/db');

const fs = require('fs');
const path = require('path');

let projectsQuery = fs.readFileSync(path.join(__dirname, "../db/select_projects.sql"), "utf-8");

/* GET events "home" page - a list of all events. */
router.get('/', async function(req, res, next) {
  // let promise = db.queryPromise(eventsQuery)
  // promise.then((results) => {
  //   res.render('events', { title: 'Events', style: "tables", events: results});
  // }).catch((err) => {
  //   next(err);
  // });

  try {
    let results = await db.queryPromise(projectsQuery)
    console.log(results);
    res.render('projects', { title: 'Projects', style: "tables", projects: results});
  } catch (err) {
    next(err);
  }

});

let project_languages_query = fs.readFileSync(path.join(__dirname, "../db/select_project_languages.sql"), "utf-8");
let project_types_query = fs.readFileSync(path.join(__dirname, "../db/select_project_types.sql"), "utf-8");


router.get('/create', async function(req, res, next) {
  try {

    let project_languages = await db.queryPromise(project_languages_query);
    let project_types = await db.queryPromise(project_types_query);
  
    res.render('projectform', {title: "Create Project", style: "newevent", 
                            project_languages:project_languages, 
                          project_types:project_types})
  } catch(err) {
    next(err);
  }
})

let singleProjectQuery = fs.readFileSync(path.join(__dirname, "../db/select_project_single.sql"), "utf-8");

router.get('/:project_id', function(req, res, next) {
  let project_id = req.params.project_id
  // GET FROM DATABASE: Select query where event_id = event_id from URL
  //For now, lets pretend
  // let event_data = {event_id: event_id,
  //                 event_name: "Opening Ceremony", 
  //                 event_location: "Auditorium",
  //                 event_date: "May 1 (Sat)",
  //                 event_time: "10:30 AM",
  //                 event_duration: "30m",
  //                 event_type: "Main",
  //                 event_interest: "100",
  //                 event_description: "Be there!"}
  db.query(singleProjectQuery, [project_id], (err, results) => {
    if (err)
      next(err);
    console.log(results);
    let project_data = results[0];
    res.render('project', { title: 'Project Details', 
                      styles: ["tables", "event"], 
                      project_id : project_id, 
                      project_data: project_data});
  });
});


let singleProjectForFormQuery = fs.readFileSync(path.join(__dirname, "../db/select_project_single_form.sql"), "utf-8");

router.get('/:project_id/modify', async function(req, res, next) {
  try {

    let project_languages = await db.queryPromise(project_languages_query);
    let project_types = await db.queryPromise(project_types_query);
    //Very much like the get('/:event_id') route... 
    let project_id = req.params.project_id
    let results = await db.queryPromise( singleProjectForFormQuery, [project_id]);
    let project_data = results[0];

    res.render('projectform', {title: "Modify Project", style: "newevent", 
                            project_languages:project_languages, 
                          project_types:project_types,
                        project:project_data}); // provide current project data
  } catch(err) {
    next(err);
  }

});

let insertProjectQuery = fs.readFileSync(path.join(__dirname, "../db/insert_project.sql"), "utf-8");
// (`event_name`, `event_location_id`, `event_type_id`, `event_dt`, `event_duration`, `event_description`) 
router.post('/', async function(req, res, next) {
  try {
    let results = await db.queryPromise(insertProjectQuery, [req.body.project_name, 
      req.body.project_owner, 
      req.body.project_members, 
      req.body.project_type,
      req.body.project_language,
      req.body.project_description,
      req.body.project_date
    ]);

  let project_id_inserted = results.insertId;
  res.redirect(`/projects/${project_id_inserted}`);
  } catch(err) {
    next(err);
  }
})

let updateProjectQuery = fs.readFileSync(path.join(__dirname, "../db/update_Project.sql"), "utf-8"); 
router.post('/:project_id', async function(req, res, next) {
  try {
    let results = await db.queryPromise(updateProjectQuery, [req.body.project_name, 
      req.body.project_owner, 
      req.body.project_members, 
      req.body.project_type_id,
      req.body.project_language_id,
      req.body.project_description,
      req.body.project_date,
      req.params.project_id
    ]);
  res.redirect(`/projects/${req.params.project_id}`);
  } catch(err) {
    next(err);
  }
})

module.exports = router;
