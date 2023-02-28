import close from '../assets/iconsBlack/chevron/left.svg';
import { Link, useNavigate } from "react-router-dom";
import Button from './Button';


function Imprint() {

const navigate = useNavigate()

	return (
	<div className="maxWidth" style={{padding: '16px 20.5px', backgroundColor: 'var(--vg-10)', height: '100vh'}}>
		<Button iconLeading={close} btn={"btn"} size={"medium"} type={"Secondary"} drop={"dropSmall"} style={{width: "48px"}} click={() => {navigate('/')}} />
		<div className="headline" style={{paddingTop: '24px'}}>
			Imprint
		</div>
		<br/>
		<div className='tut' style={{color: 'var(--vg-100)'}}>
			<p>Angaben gemäß § 5 TMG </p>
			Eric Wätke & Silas Wolf<br/>
			No cards needed <br/>eine Kartenspiel Simulation <br/>
			<br/>
			Kastanienallee 17<br/>
			14471 Potsdam<br/>
			<br/>
			<p>Kontakt</p>
			E-Mail: mail?!!!<br/>
			Verbraucherstreitbeilegung/<br/>Universalschlichtungsstelle<br/>
			<br/>
			Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.<br/>
			<br/>
			Quelle:<br/>
			<a href='https://www.e-recht24.de'>eRecht24</a>
		</div>
	</div>
	);
}

export default Imprint