import useSWR from 'swr';
import Error from 'next/error';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Link from 'next/link';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function ArtworkCard(props) {
    const { objectID } = props;
    const { data, error } = useSWR(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`, fetcher);
    if (error) {
        return <Error statusCode={404} />
    }
    else if( data==null || data == undefined)
    {
        return null
    }
    return (
        <Card style={{ width: '16rem' }}>
        <Card.Img variant="top" src={data.primaryImageSmall ? data.primaryImageSmall :' https://via.placeholder.com/375x375.png?text=[+Not+Available+]' } />
        <Card.Body>
            <Card.Title>{data.title?data.title:"N/A"}</Card.Title>
            <Card.Text>
            <strong>Date:</strong> {data.objectDate?data.objectDate:"N/A"} <br/>
            <strong>Classification:</strong> {data.classification?data.classification:"N/A"}<br/>
            <strong>Medium:</strong> {data.medium?data.medium:"N/A"}<br/>
            </Card.Text>
            <Link href={`/artwork/${objectID}`}  passHref>
                <Button variant="primary">ID: {data?.objectID}</Button>
            </Link>
        </Card.Body>
        </Card>
        )
}