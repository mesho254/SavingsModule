const express = require('express');
const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const corsOptions = { origin: "*", credentials: true, optionSuccessStatus: 200 };
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');


const authRoutes = require('./routes/auth');
const goalRoutes = require('./routes/goals');
const transactionRoutes = require('./routes/transactions');
const analyticsRoutes = require('./routes/analytics');
const adminRoutes = require('./routes/admin');
const reconciliationRoutes = require('./routes/reconciliation');

const app = express();
dotenv.config();

// Connect to database
const mongooseOptions={
  useNewUrlParser:true,
  useUnifiedTopology:true
};
mongoose.connect(process.env.MONGO_URI,
mongooseOptions,err=>{
  if(err){
      console.log(err)
  }
  else{
      console.log("Connected to MongoDB")
  }
});


app.use(cors(corsOptions));
app.use(express.json());
// app.use(bodyParser.json());

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Savings Module API',
      version: '1.0.0',
      description: 'API for parent savings and analytics',
    },
    servers: [{ url: 'http://localhost:5000' }],
  },
  apis: ['./routes/*.js'], // Paths to files containing OpenAPI definitions
  components: {
  securitySchemes: {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    },
  },
},
};

const specs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use('/api/auth', authRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reconciliation', reconciliationRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    team_name: "Mesho Devs", dev_team: ["Mesho", "Mesho254"].sort()
  });
});

app.use("/*splat", (req, res) => {
  res.status(500).json({ status: "error", message: "This route does not exist" });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}. Swagger docs at http://localhost:${PORT}/api-docs`));