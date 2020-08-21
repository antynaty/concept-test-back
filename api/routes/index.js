const charRoutes = require('./charRoutes'); 
const planetRoutes = require('./planetRoutes');

module.exports = app => {
    app.get('/', (req, res) => {
        res.send('<h4> Server is running on PORT: 3030. Database is connected </h4>');
    });

    app.use('/chars', charRoutes); 
    app.use('/planets', planetRoutes); 
}