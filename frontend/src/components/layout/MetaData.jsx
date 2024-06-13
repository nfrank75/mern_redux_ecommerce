import { Helmet } from 'react-helmet'

const MetaData = ({ title }) => {
  return (
    <Helmet>
        <title> {`${title} - nShopIt`}</title>
    </Helmet>
  );
};

export default MetaData;
