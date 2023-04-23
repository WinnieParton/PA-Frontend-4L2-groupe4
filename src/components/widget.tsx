import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import PeopleIcon from '@mui/icons-material/People';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
type Props = {
    type: string;
};
const Widget = ({ type }: Props) => {
    let data;

    switch (type) {
        case 'jeux':
            data = {
                title: 'Jeux',
                counter: 16,
                link: 'Tous les jeux',
                icon: <SportsEsportsIcon className="icon" style={{ backgroundColor : "rgba(45, 83, 221,0.2)", color : "rgb(45, 83, 221)"  }}/>,
            };
            break;
        case 'amis':
            data = {
                title: 'Amis',
                counter: 288,
                link: 'Tous les amis',
                icon: <PeopleIcon className="icon" style={{ backgroundColor : "rgba(11, 162, 11,0.2)", color : "rgb(11, 162, 11)"  }} />,
            };
            break;
        case 'salons':
            data = {
                title: 'Salons',
                counter: 19,
                link: 'Tous les salons',
                icon: <MeetingRoomIcon className="icon" style={{ backgroundColor : "rgba(220, 30, 62,0.2)", color : "rgb(220, 30, 62)"  }}/>,
            };
            break;

        default:
            break;
    }

    return (
        <div className="widget">
            <div className="left">
                <span className="title">{data?.title}</span>
                <span className="counter">{data?.counter}</span>
                <span className="link">{data?.link}</span>
            </div>
            <div className="right">{data?.icon}</div>
        </div>
    );
};

export default Widget;
