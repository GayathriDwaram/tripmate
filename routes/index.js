var express = require('express');
var router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const authenticate = (req, res, next) => {
  if (req.session.user) {
    next();
  }
  else {
    res.redirect('/');
  }
};

/* GET Login page. */
router.get('/', async function (req, res, next) {
  const { email, password } = req.body;
  res.render('login', { title: 'Express' });
});

router.post('/', async function (req, res, next) {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: {
        Email: email,
      },
    });
    console.log({ user })
    if (user.Password === password) {
      req.session.user = {
        id: user.User_ID,
        role: user.Role,
      };
      res.redirect('/dashboard');
    }
    else {
      res.render('login', { title: 'Express' });
    }
  }
  catch (err) {
    console.log(err);
    res.render('login', { title: 'Express' });
  }
});


router.get('/signup', function (req, res, next) {
  res.render('signup', { message: '' });
});

router.post('/signup', async function (req, res, next) {
  const { email, password, mobile, address, first_name, last_name, role } = req.body;

  const user = {
    Email: email,
    Password: password,
    Mobile: mobile,
    Address: address,
    First_Name: first_name,
    Last_Name: last_name,
    Role: role,
  };

  try {
    await prisma.user.create({
      data: user,
    });
    res.render('signup', { message: 'Account created successfully' });
  }
  catch (err) {
    console.log(err);
    res.render('signup', { message: 'Account creation failed' });
  }
});

// logout
router.get('/logout', function (req, res, next) {
  req.session.destroy();
  res.redirect('/');
});

// dashboard  
router.get('/dashboard', authenticate, function (req, res, next) {
  console.log(req.session.user)
  res.render('dashboard', { title: 'Express' });
});

// rides
router.get('/rides', authenticate, async function (req, res, next) {
  let where = {};
  if (req.session.user.role === 'driver') {
    where = {
      driver_id: req.session.user.id,
    };
  }
  else if (req.session.user.role === 'user') {
    where = {
      user_id: req.session.user.id,
    };
  }
  const rides = await prisma.ride.findMany({
    where,
    include: {
      user: true,
      driver: true,
    }
  });
  console.log({ rides })
  res.render('rides', { rides });
});


// new
router.get('/rides/new', authenticate, async function (req, res, next) {
  res.render('new_ride');
});

// post
router.post('/rides/new', authenticate, async function (req, res, next) {
  const { start_time, end_time, start_location, end_location, tip } = req.body;
  // get random driver
  const driver = await prisma.user.findFirst({
    where: {
      Role: 'driver',
    },
    include: {
      vehicle: true,
    }
  });

  console.log({ driver })


  console.log(driver, req.session)
  const ride = {
    start_time: new Date(start_time),
    end_time: new Date(end_time),
    start_location,
    end_location,
    price: parseFloat(Math.random() * 100),
    tip: parseFloat(tip),
    user: {
      connect: {
        User_ID: req.session.user.id,
      }
    },
    driver: {
      connect: {
        User_ID: driver.User_ID,
      }
    },
    vehicle: {
      connect: {
        id: driver.vehicle[0].id,
      }
    },

  };

  try {
    await prisma.ride.create({
      data: {
        ...ride,
        total: ride.price + ride.tip,
        status: "in_progress",
      },
    });
    res.redirect('/rides');
  }
  catch (err) {
    console.log(err);
    res.render('new_ride');
  }
});


// vehcile create or update
router.post('/vehicle', authenticate, async function (req, res, next) {
  const { type, model, year, color, plate } = req.body;
  const user = await prisma.user.findUnique({
    where: {
      User_ID: req.session.user.id,
    },
  });
  const vehicle = {
    type,
    model,
    color,
    plate,
    user: {
      connect: {
        User_ID: user.User_ID,
      }
    },
  };

  try {
    const isExists = await prisma.vehicle.findFirst({
      where: {
        user_id: {
          equals: req.session.user.id,
        }
      },
    });

    const data = await prisma.vehicle.upsert({
      where: {
        id: isExists?.id || 0,
      },
      update: {
        ...vehicle,
      },
      create: {
        ...vehicle,
      },
    });
    console.log(data);
    res.redirect('/profile');
  }
  catch (err) {
    console.log(err);
    res.redirect('/profile');
  }
});


// profile
router.get('/profile', authenticate, async function (req, res, next) {
  try {
    // if role is driver then get vehicle
    let vehicle = null;
    if (req.session.user.role === 'driver') {
      vehicle = await prisma.vehicle.findFirst({
        where: {
          user_id: {
            equals: req.session.user.id,
          }
        },
      });
    }
    const payment = await prisma.payment.findMany({
      where: {
        user_id: {
          equals: req.session.user.id,
        }
      },
    });

    console.log({ vehicle, payment })

    res.render('profile', { vehicle, payment: payment[0] });
  } catch (err) {
    console.log(err);
    res.render('profile');
  }
});

// update ride
router.post('/rides/:id/:status', authenticate, async function (req, res, next) {
  const { id, status } = req.params;
  try {
    const ride = await prisma.ride.update({
      where: {
        id: parseInt(id),
      },
      data: {
        status,
      },
    });
    res.redirect('/rides');
  }
  catch (err) {
    console.log(err);
    res.redirect('/rides');
  }
});

// same for shipment
/**model shipment {
  id             Int      @id @default(autoincrement())
  shipment_code  String   @db.VarChar(255)
  user_id        Int      @db.Int
  driver_id      Int      @db.Int
  start_time     DateTime @db.DateTime
  end_time       DateTime @db.DateTime
  price          Int      @default(0) @db.Int
  tip            Int      @default(0) @db.Int
  total          Int      @default(0) @db.Int
  start_location String?  @db.VarChar(255)
  end_location   String?  @db.VarChar(255)
  status         String   @db.VarChar(255)
  created_at     DateTime @default(now())
  updated_at     DateTime @default(now())
  user           user     @relation("user", fields: [user_id], references: [User_ID])
  driver         user     @relation("driver", fields: [driver_id], references: [User_ID])
  points         points[]
}
 */
router.get('/shipments', authenticate, async function (req, res, next) {
  let where = {};
  if (req.session.user.role === 'driver') {
    where = {
      driver_id: req.session.user.id,
    };
  }
  else if (req.session.user.role === 'user') {
    where = {
      user_id: req.session.user.id,
    };
  }
  const shipments = await prisma.shipment.findMany({
    where,
    include: {
      user: true,
      driver: true,
    }
  });
  console.log({ shipments })
  res.render('shipments', { shipments });
});

// add shipment by user
router.get('/shipments/new', authenticate, async function (req, res, next) {
  res.render('new_shipment');
});


// add shipment by user
router.post('/shipments/new', authenticate, async function (req, res, next) {
  const { start_time, end_time, start_location, end_location, tip } = req.body;
  // get random driver
  const driver = await prisma.user.findFirst({
    where: {
      Role: 'driver',
    },
    include: {
      vehicle: true,
    }
  });

  console.log({ driver })

  const shipment = {
    start_time: new Date(start_time),
    shipment_code: Math.random().toString(36).substring(7),
    end_time: new Date(end_time),
    start_location,
    end_location,
    // round
    price: Math.round(Math.random() * 100),
    tip: parseFloat(tip),
    user: {
      connect: {
        User_ID: req.session.user.id,
      }
    },
    driver: {
      connect: {
        User_ID: driver.User_ID,
      }
    },

  };

  try {
    await prisma.shipment.create({
      data: {
        ...shipment,
        total: shipment.price + shipment.tip,
        status: "in_progress",
      },
    });
    res.redirect('/shipments');
  }
  catch (err) {
    console.log(err);
    res.render('new_shipment');
  }
});

// update shipment
router.post('/shipments/:id/:status', authenticate, async function (req, res, next) {
  const { id, status } = req.params;
  try {
    const shipment = await prisma.shipment.update({
      where: {
        id: parseInt(id),
      },
      data: {
        status,
      },
    });
    res.redirect('/shipments');
  }
  catch (err) {
    console.log(err);
    res.redirect('/shipments');
  }
});

// users get
router.get('/users', authenticate, async function (req, res, next) {
  const users = await prisma.user.findMany({
    where: {
      Role: {
        not: 'admin',
      }
    },
  });
  res.render('users', { users });
});

// history same as rides
router.get('/history', authenticate, async function (req, res, next) {
  const rides = await prisma.ride.findMany({
    where: {
      user_id: req.session.user.id,
    },
    include: {
      user: true,
      driver: true,
    }
  });
  res.render('history', { rides });
});

// view ride
router.get('/rides/:id', authenticate, async function (req, res, next) {
  const { id } = req.params;
  const ride = await prisma.ride.findFirst({
    where: {
      id: parseInt(id),
    },
    include: {
      user: true,
      driver: true,
    }
  });
  res.render('ride', { ride });
});

// create or update payment
router.post('/payment', authenticate, async function (req, res, next) {
  const { card_number, cvv, expiry_date } = req.body;

  try {
    const isExists = await prisma.payment.findFirst({
      where: {
        user_id: req.session.user.id,
      }
    });
    const payment = await prisma.payment.upsert({
      where: {
        id: isExists?.id || 0,
      },
      update: {
        card_number,
        cvv,
        exp_date: new Date(expiry_date),
      },

      create: {
        card_number,
        cvv,
        exp_date: new Date(expiry_date),
        user: {
          connect: {

            User_ID: req.session.user.id,
          }
        }
      }
    });
    res.redirect('/profile');
  }
  catch (err) {
    console.log(err);
    res.redirect('/profile');
  }
});


module.exports = router;
