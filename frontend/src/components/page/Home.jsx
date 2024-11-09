
import AutoType from "../AutoTyping";
import HomeSlider from "../HomeSlider"
import { Grid, Card, CardContent, CardMedia, Typography, Box,List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import DoneAllSharpIcon from '@mui/icons-material/DoneAllSharp';
import VerifiedUserSharpIcon from '@mui/icons-material/VerifiedUserSharp';
import AirplaneTicketIcon from '@mui/icons-material/AirplaneTicket';
import CleanHandsIcon from '@mui/icons-material/CleanHands';
import GrassIcon from '@mui/icons-material/Grass';
import KayakingIcon from '@mui/icons-material/Kayaking';
import TrackingForm from "../TrackingForm";


const Beyond=[
  {
    title:'Certified Processs',
    description:'We drive towards your continuous improvement',
    icon:<CleanHandsIcon/>
  },

  {
    title:'Certified Processs',
    description:'We drive towards your continuous improvement',
    icon:<KayakingIcon />
  },

  {
    title:'Certified Processs',
    description:'We drive towards your continuous improvement',
    icon:<GrassIcon />
  },
]




const cards = [
  {
    title: 'Card 1',
    image: 'https://images.unsplash.com/photo-1719937206109-7f4e933230c8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxMXx8fGVufDB8fHx8fA%3D%3D',
    description: 'ConsignCloud is an easy to use consignment and reseller software that makes running every aspect of your consignment store painless. Start a free trial now!.',
  },
  {
    title: 'Card 2',
    image: 'https://images.unsplash.com/photo-1719937206109-7f4e933230c8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxMXx8fGVufDB8fHx8fA%3D%3D',
    description: 'ConsignCloud is an easy to use consignment and reseller software that makes running every aspect of your consignment store painless. Start a free trial now!',
  },
  {
    title: 'Card 3',
    image: 'https://images.unsplash.com/photo-1719937206109-7f4e933230c8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxMXx8fGVufDB8fHx8fA%3D%3D',
    description: 'ConsignCloud is an easy to use consignment and reseller software that makes running every aspect of your consignment store painless. Start a free trial now!.',
  },
  {
    title: 'Card 4',
    image: 'https://source.unsplash.com/random/800x600',
    description: 'This is the description for card 4.',
  },
  {
    title: 'Card 5',
    image: 'https://source.unsplash.com/random/800x600',
    description: 'ConsignCloud is an easy to use consignment and reseller software that makes running every aspect of your consignment store painless. Start a free trial now!.',
  },
  {
    title: 'Card 6',
    image: 'https://source.unsplash.com/random/800x600',
    description: 'This is the description for card 6.',
  },
];



const items=[
  {text:'Real time tracking',icon:<DoneAllSharpIcon />},
  { text:'We provide our customers with affordable rate',icon:<DoneAllSharpIcon />},
  {text:'World class storage facilities', icon:<DoneAllSharpIcon />}
 
];


const items2=[
    {
      title:'Secure packaging',
      icon:<VerifiedUserSharpIcon sx={{fontSize:40,pr:2,color:"skyblue"}}/>,
      text:'we prioritize the safety and integrity of your goods throughout the entire logistics process. Our secure packaging solutions are designed to safeguard your products from damage and ensure they arrive at their destination in pristine condition.'
    },

    {
      title:'Fast shipping',
      icon:<AirplaneTicketIcon sx={{fontSize:40,pr:2,color:"skyblue"}}/>,
      text:"When aiming to offer fast shipping, whether for a small business or a larger enterprise, several key considerations and strategies can help ensure quick and efficient delivery. Here's a comprehensive guide to achieving fast shipping:"
    }
]






const Home=()=>{


  return(
    <div>
      <HomeSlider/>
      <TrackingForm/>
      
      <Box sx={{ p:8 }}>
        <Typography variant="h6" sx={{textAlign:'center',fontWeight:'600',fontSize:{xs:'15px',sm:'20px'}}}><AutoType text="WHAT WE DO" speed={100}></AutoType></Typography>
        <Typography variant="h6"  sx={{pb:2,textAlign:'center' ,fontFamily:'Arial,helvetica,san-seriff,roboto',fontSize:{xs:'30px',sm:'35px'},fontWeight:'bold',color:'skyblue'}}>Our Services</Typography>

      <Grid container spacing={4}>
        {cards.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card className="card">
              <CardMedia
                component="img"
                height="100%"
                width="300px"
                image={card.image}
                alt={card.title}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {card.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {card.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

          <div style={{paddingTop:'80px',paddingBottom:'60px'}}>
            <Grid container spacing={6} alignItems={"stretch"}>
                <Grid item xs={12} md={6}>
                    <Box sx={{height:'100%',margin:0, paddingTop:'60px'}}>
                          <img src="https://images.unsplash.com/photo-1719937050640-71cfd3d851be?q=80&w=1744&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" style={{
                            width:'100%', height:'100%', 
                            objectFit:'cover'
                          }}
                          loading='Lazy'
                          />
                    </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Box sx={{
                      height:'100%',
                      pt:'20px'
                     
                   
                    }}>
                      <Typography variant='h6' component='h4' sx={{fontFamily:'Roboto,Arial,san-serrif',fontWeight:'bold', mt:'16px'}} gutterBottom>
                         About us
                      </Typography>
                      <Typography variant='body1' sx={{pt:2,fontFamily:'Roboto,Arial,san-serrif'}} gutterBottom>
                      We are a globally recognized integrated logistics service provider,
                       with an extensive network spanning over 130 countries. With our own offices strategically located in major commercial hubs, we ensure seamless and efficient logistics solutions tailored to meet the unique needs of our clients.
                      </Typography>
                      <Typography variant='body1' sx={{fontFamily:'Roboto,Arial,san-serrif'}}>
                        The company was established to cater for commercial and local shipping world wide, with our headquarter in Uk Branches
                      </Typography>

                      <List>
                            {items.map((item,index)=>(
                              <ListItem sx={{mb:{xs:'-8px'}}} key={index}>
                                  <ListItemIcon sx={{color:'skyblue'}}>{item.icon}</ListItemIcon>
                                  <ListItemText>{item.text}</ListItemText>
                              </ListItem>
                            ))}
                       </List>


                       <Grid container spacing={4}>
                            {items2.map((item1,index)=>(
                              <Grid item xs={12} md={6} key={index} >
                                  <Card sx={{
                                    borderBottom:'4px solid skyblue',
                                    transition:'transform 0.3s, box-shadows 0.3s',
                                    '&:hover':{
                                      transform:'scale(1.3s)',
                                      boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.2)',
                                    }
                                    

                                  }}>
                                      <CardContent>
                                          <Typography variant="h6" gutterBottom component='div' sx={{mb:2,display:'flex', alignItems:'center', fontFamily:'sans-serif,roboto,Arial',fontWeight:'bold', }}>
                                              {item1.icon}
                                              <span sx={{marginLeft:'8px'}}>{item1.title}</span>
                                          </Typography>
                                          <Typography variant='body1'>
                                            {item1.text}
                                          </Typography>
                                      </CardContent>
                                  </Card>
                              </Grid>
                            ))}
                       </Grid>
                    </Box>

                    
                </Grid>
            </Grid>
          </div>
    </Box>

      <div>
      <Box sx={{
        position: 'relative',
        width: { xs: '92%', sm: '92%' },  // Full width on small screens, 92% on larger
        height: { xs: 'auto', sm: '400px', md: '500px' }, // Auto height on small, fixed on larger screens
        backgroundImage: 'url(https://images.unsplash.com/photo-1646047354754-6e86d4d9fc68?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzJ8fGxvZ2lzdGljfGVufDB8fDB8fHww)',
        margin: { xs: '0 16px', sm: '0 auto' }, // Margin adjustment for small screens
        backgroundSize: { xs: 'cover', sm: 'cover' }, // Ensure the background covers the entire area
        backgroundPosition: { xs: 'center', sm: 'top -40px' }, // Center on small screens, custom on larger screens
        // display: 'flex',
        // justifyContent: 'center',
        // alignItems: 'center', // Center content vertically
        backgroundRepeat: 'no-repeat',
       

        '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adjust the rgba value to control the opacity and color
      zIndex: 1,
    },
    '& > *': {
      position: 'relative',
      zIndex: 2,
    },

     }}>


    <Grid 
  container 
  spacing={2} 
  sx={{
    // Center the entire container on small screens
    justifyContent: { xs: 'center', sm: 'flex-start' },
    alignItems: 'center',
    margin: { xs: '0 auto', sm: '0 auto' },  // Center the container with auto margins
    textAlign: { xs: 'center', sm: 'left' },  // Center text on small screens
    fontFamily: 'San-serif, Roboto, Arial',
    display: 'flex',
    flexDirection: { xs: 'column', sm: 'row' },  // Stack items vertically on small screens
    paddingBottom:'14rem'
  }}
>
  <Grid item xs={12} md={3}>
    <Typography variant='h6' gutterBottom sx={{ color:'whitesmoke',fontWeight: 'bold', fontSize: { xs: '30px', sm: '40px' } }}>
      Beyond logistics
    </Typography>
    <Typography variant='body1' gutterBottom sx={{ color: 'white', margin:{xs:'0 4px'} }}>
      Beyond logistics providers offer end-to-end supply chain management, from sourcing raw materials to delivering finished goods to customers.
    </Typography>
  </Grid>


  <Grid item xs={12} md={3} >
              <Card sx={{backgroundColor: 'transparent', boxShadow: 'none', color:'white'}}>
                <CardContent>
                  <Typography sx={{ display: 'flex', mb: 2, justifyContent:{xs:'center'} }}>
                    <KayakingIcon sx={{ color:'skyblue',fontSize: { xs: '50px', sm: '60px' } }} />
                    <span style={{ marginLeft: '18px', fontSize:'20px' }} 
                          sx={{ fontWeight: {xs:'bold',sm:'600px'} }}>
                      Certified Process
                    </span>
                  </Typography>
                  <Typography sx={{color:{xs:'skyblue'}, fontSize:{xs:'15px'},display: 'flex',mt:{xs:'-35px',sm:-'-6px'}, ml: { xs: '70px',sm:'' }, justifyContent: { xs: 'center', sm: 'center' } }}>
                    We drive towards your <br/>continuous improvement
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={3} >
              <Card sx={{backgroundColor: 'transparent', boxShadow: 'none', color:'white'}}>
                <CardContent>
                  <Typography sx={{ display: 'flex', mb: 2, justifyContent:{xs:'center'} }}>
                    <CleanHandsIcon sx={{ color:'skyblue',fontSize: { xs: '50px', sm: '60px' } }} />
                    <span style={{ marginLeft: '18px', fontSize:'20px' }} 
                          sx={{ fontWeight: {xs:'bold',sm:'600px'} }}>
                      Certified Process
                    </span>
                  </Typography>
                  <Typography sx={{color:{xs:'skyblue'}, fontSize:{xs:'15px'},display: 'flex',mt:{xs:'-35px',sm:-'-6px'}, ml: { xs: '70px',sm:'' }, justifyContent: { xs: 'center', sm: 'center' } }}>
                    We drive towards your <br/>continuous improvement
                  </Typography>
                </CardContent>
              </Card>
            </Grid>






            <Grid item xs={12} md={3} >
              <Card sx={{backgroundColor: 'transparent', boxShadow: 'none', color:'white'}}>
                <CardContent>
                  <Typography sx={{ display: 'flex', mb: 2, justifyContent:{xss:'center'} }}>
                    <GrassIcon sx={{ color:'skyblue',fontSize: { xs: '50px', sm: '60px' } }} />
                    <span style={{ marginLeft: '18px', fontSize:'20px' }} 
                          sx={{ fontWeight: {xs:'bold',sm:'600px'} }}>
                      Certified Process
                    </span>
                  </Typography>
                  <Typography sx={{color:{xs:'skyblue'}, fontSize:{xs:'15px'},display: 'flex',mt:{xs:'-35px',sm:-'-6px'}, ml: { xs: '70px',sm:'-10px' }, justifyContent: { xs: 'center', sm: 'center' } }}>
                    We drive towards your <br/>continuous improvement
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Box sx={{mt:-20,ml:'20px', color:'white', fontSize:{xs:'12px',sm:'15px'}}}>
              <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Typography>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus nemo aspernatur quos est perspiciatis, dolores impedit, magnam sit laudantium velit ipsa reprehenderit asperiores deserunt, cum nostrum quaerat. Possimus, sed. Rem?</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus nemo aspernatur quos est perspiciatis, dolores impedit, magnam sit laudantium velit ipsa reprehenderit asperiores deserunt, cum nostrum quaerat. Possimus, sed. Rem?</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus nemo aspernatur quos est perspiciatis, dolores impedit, magnam sit laudantium velit ipsa reprehenderit asperiores deserunt, cum nostrum quaerat. Possimus, sed. Rem?</Typography>
                  </Grid>
              </Grid>
          </Box>

     </Box>
      </div>
    </div>
  )
}

export default Home;