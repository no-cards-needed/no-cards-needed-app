import close from '../assets/iconsBlack/chevron/left.svg';
import { Link } from "react-router-dom";


function About() {

    return (
      <div className="maxWidth" style={{padding: '16px 20.5px', backgroundColor: 'var(--vg-10)', height: '100vh'}}>
        <Link to="/" className="btn Secondary medium noselect" id="basicDrop" style={{width: "48px"}}>
          <img className="iconContainer" src={close} alt=""></img>
        </Link>
        <div className="headline" style={{paddingTop: '24px'}}>
          About
        </div>
        <br/>
        <div className='tut' style={{color: 'var(--vg-100)'}}>
          No cards needed is an online playing card simulation. It provides a framework to play any game – that is played with standard playing cards. <br/>
          That means there are no more rules to follow than the rules you make up yourself.
          <br/>
          <br/>
          This Game was made <br/> by <a href='https://ericwaetke.com/de/'>Eric Wätke</a> & <a href='http://solidjellycube.de'>Silas Wolf</a>
        </div>
      </div>
    );
  }

export default About