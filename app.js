const Joi = require('joi');
const express = require('express')
const app = express();

//Middleware for app.post for req.body
app.use(express.json())


function validateCourse(course){
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });
    return schema.validate(course)
     
}

const courses = [
    {id: 1, name: 'course1'},
    {id: 2, name: 'course2'},
    {id: 3, name: 'course3'},
    {id: 4, name: 'course4'}
]

app.get('/', (req, res) => {
    res.send('Hello World')
})


// GET All e courses  
app.get('/api/courses', (req, res) => {
    //Printing URL
    // res.send(req.url);
    res.send(courses);
})

//Get a single course
//Route parameters using : , and acessing it using req.params
app.get('/api/courses/:id', (req, res) => {
    // res.send(req.params.id);
    //We can also get query parameters
    // res.send(req.query);
    // console.log(req.params);
    const {id} = req.params;
    const course = courses.find(c => c.id === parseInt(id))
    if(!course){
        return res.status(404).send('The course was not found')
    }
    res.send(course);
})

app.post('/api/courses',  (req, res) => {
    const result = validateCourse(req.body);
    if(result.error){
        return res.status(400).send(result.error.details[0].message);
    }
    const course =  {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
})

app.put('/api/courses/:id', (req, res) => {
    //Lookup the course
     const {id} = req.params;
    const course = courses.find(c => c.id === parseInt(id))
     //If not exists
    if(!course){
        return res.status(404).send('The course was not found')
    }
    const result = validateCourse(req.body);
    if(result.error){
        return res.status(400).send(result.error.details[0].message);
    }
    //Update the course
    course.name = req.body.name;
    //return updated course
    res.send(course)
})

app.delete('/api/courses/:id', (req, res) => {
    //Lookup the course
    const {id} = req.params;
    const course = courses.find(c => c.id === parseInt(id))
     //If not exists
    if(!course){
        return res.status(404).send('The course was not found')
    }

    const index = courses.indexOf(course);
    courses.splice(index, 1);
    res.send(course);

})


//PORT
const port = process.env.PORT || 3000;

//Starting a server with port number
app.listen(port, () => { console.log(`Listening at port ${port}`); })