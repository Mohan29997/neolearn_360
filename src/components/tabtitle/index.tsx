import { Helmet } from 'react-helmet';


const TabTitle = ({ title }: { title?: string }) => {
    return (
        <Helmet>
            <title>{title ? `Neo Learn 360 - ${title}` : "Neo Learn 360"}</title>
        </Helmet>
    );
}

export default TabTitle;
