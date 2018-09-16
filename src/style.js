//style.js
const style = {

  content:{
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
  },
  tile:{
    width: '100%',
    height: '100%',
    paddingTop: "3px",
    position: 'relative',
    display: 'block',
  },
//grass tile color
  grasstile: {
   
    backgroundColor: "#9fd64d",
  },
  tilebutton: {
    border: "2px solid ",
    borderRadius: "6px",
    color: "black",
    backgroundColor: "Transparent",
    marginBottom: "5px",
    marginRight: "2px",
    marginLeft: "2px",
    marginTop: "5px",
  },
  emptybutton: {
    padding: "0",
    paddingLeft: "5px",
    border: "none",
    background: "none",
    margin: "none",
  },
// w h were 8vmin before
  images: {
    // maxWidth: "30vmin",
    // maxHeight: "30vmin",
    //position: "absolute",
    //minHeight: "100%",
    //maxWidth: "100%",
    //maxHeight: "100%",
    //maxWidth: "100%",
    marginLeft: "auto",
    marginRight: "auto",
    //minWidth: "120%",
    width: "200%",
    //height: "auto",
    display: "block",
    //objectFit: "cover",
    // paddingTop: "5",
    // paddingBottom: "6",
    // paddingLeft: "5",
    // paddingRight: "5",
    // border: "2px solid",
    // borderColor: "#000000",
    // marginLeft: "5px",
    // marginRight: "5px",
    // marginBottom: "5px",
    // marginTop: "5px",
    //backgroundColor: "#000000",

  },
  imgcontWrapper: {
    overflow: 'hidden',
    maxHeight: '60%',
  },
  imgcont: {
    border: "2px solid",
    borderColor: "#000000",
    position: "relative",
    overflow: "hidden",
    maxHeight: "60%",
    maxWidth: "100%",
    marginLeft: "10px",
    marginRight: "10px",
    objectFit: "fill",
    objectPosition: "center",
    visibility:'hidden',
  },
  griddiv :{
    //backgroundColor: "#d4ff8c",
  },
  filterRow: {
    paddingBottom: "10px",
    marginTop: "-20px",
  },
  invisibleImage: {
    opacity: 0,    
    width: "10vmin",
    height: "10vmin",
    paddingTop: "4",
    paddingBottom: "5",

  },
  wateringRow: {
    display: "inline-block",
    margin: "auto",
    paddingTop: "5px",
    paddingBottom: "5px",
  },
  buttonRow: {
    display: "inline-block",
    margin: "auto",
    paddingBottom: "5px",
  },
  biologybutton: {
    border: "2px solid ",
    color: "black",
    backgroundColor: "Transparent",
    marginBottom: "16px",
    marginRight: "2px",
    marginLeft: "2px",
  },
  tilebox:{
    border: '1px solid',
    position: 'relative',
    display: 'inline-block',
  },
  commentBox: {
    maxWidth:'1600px',
    margin:'0 auto',
    fontFamily:'Helvetica, sans-serif',
    backgroundColor: '#e1edb4',
    border: '20px solid rgb(225, 237, 180)',
    //backgroundImage: "url('https://i.imgur.com/Ywcvr7u.jpg')",
  },
  title: {
    textAlign:'center',
    textTransform:'uppercase'
  },
  commentList: {
    border:'1px solid #f1f1f1',
    padding:'0 12px',
    maxHeight:'70vh',
    //overflow:'scroll'
  },
  comment: {
    backgroundColor:'#fafafa',
    margin:'10px',
    padding:'3px 10px',
    fontSize:'2rem'
  },
  commentForm: {
    margin:'10px',
    display:'flex',
    flexFlow:'row wrap',
    justifyContent:'space-between'
  },
  commentFormAuthor: {
    minWidth:'150px',
    margin:'3px',
    padding:'0 10px',
    borderRadius:'3px',
    height:'40px',
    flex:'2'
  },
  commentFormText: {
    flex:'4',
    minWidth:'400px',
    margin:'3px',
    padding:'0 10px',
    height:'40px',
    borderRadius:'3px'
  },
  commentFormPost: {
    minWidth:'75px',
    flex:'1',
    height:'40px',
    margin:'5px 3px',
    fontSize:'1rem',
    backgroundColor:'#83b538',
    borderRadius:'3px',
    color:'#000',
    textTransform:'uppercase',
    letterSpacing:'.055rem',
    border:'none'
  },
  commentFormPost1: {
    minWidth:'75px',
    flex:'1',
    height:'40px',
    margin:'5px 3px',
    fontSize:'1rem',
    backgroundColor:'#4331a3',
    borderRadius:'3px',
    color:'#000',
    textTransform:'uppercase',
    letterSpacing:'.055rem',
    border:'none'
  },
  commentFormPost2: {
    minWidth:'75px',
    flex:'1',
    height:'40px',
    margin:'5px 3px',
    fontSize:'1rem',
    backgroundColor:'#7c1123',
    borderRadius:'3px',
    color:'#000',
    textTransform:'uppercase',
    letterSpacing:'.055rem',
    border:'none'
  },
  searchFormText: {
    flex:'4',
    minWidth:'250px',
    margin:'3px',
    padding:'0 10px',
    height:'40px',
    borderRadius:'3px'
  },
  stayDown: {
    position: 'absolute',
    bottom: "5px",
    width:'inherit',
  },
  updateLink: {
    textDecoration:'none',
    paddingRight:'15px',
    fontSize:'1.5rem'
  },
  deleteLink: {
    textDecoration:'none',
    paddingRight:'15px',
    fontSize:'1.5rem',
    color:'red'
  },

}

module.exports = style;
