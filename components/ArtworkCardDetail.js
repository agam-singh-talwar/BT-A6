import { useAtom } from 'jotai';
import { favouritesAtom } from '@/store';
import { useState, useEffect } from 'react'
import { Button } from 'react-bootstrap';
import useSWR from 'swr';
import Error from 'next/error';
import Card from 'react-bootstrap/Card';
import { addToFavourites, removeFromFavourites } from '@/lib/userData';
const fetcher = (url) => fetch(url).then((res) => res.json());

export default function ArtworkCardDetail(props) {
    console.log("🚀 ~ file: ArtworkCardDetail.js:12 ~ ArtworkCardDetail ~ props:", props)
    const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);
    const [showAdded, setShowAdded] = useState(false);
    useEffect(() => {
        setShowAdded(favouritesList?.includes(objectID))
    }, [favouritesList])
    const favouritesClicked = async () => {
        if (showAdded == true) {
            setFavouritesList(await removeFromFavourites(props.objectID));
            setShowAdded(false)
        }
        else {
            setFavouritesList(await addToFavourites(props.objectID));
            setShowAdded(true)
        }
    }
    const { objectID } = props
    const { data, error } = useSWR(objectID ? `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}` : null);
    if (error) {
        return <Error statusCode={404} />
    }
    else if (data == null || data == undefined) {
        return null
    }
    else {
        return (
            <Card>
                <Card.Img variant="top" src={data.primaryImageSmall ? data.primaryImageSmall : ' https://via.placeholder.com/375x375.png?text=[+Not+Available+]'} />
                <Card.Body>
                    <Card.Title>{data.title ? data.title : "N/A"}</Card.Title>
                    <Card.Text>
                        <strong>Date:</strong> {data.objectDate ? data.objectDate : "N/A"} <br />
                        <strong>Classification:</strong> {data.classification ? data.classification : "N/A"}<br />
                        <strong>Medium:</strong> {data.medium ? data.medium : "N/A"}
                        <br /><br />
                        {data.artistDisplayName ? (<div><strong>Artist:</strong> {data.artistDisplayName}<a href={data.artistWikidata_URL}>  (wiki)</a></div>) : <div><string>Artist: N/A</string></div>}
                        <strong>Credit Line:</strong> {data.creditLine} <br />
                        <strong>Dimensions:</strong> {data.dimensions} <br />
                        <Button variant={showAdded ? 'primary' : 'outline-primary'} onClick={favouritesClicked}>{showAdded ? '+ Favourite (added)' : '+ Favourite'}</Button>
                    </Card.Text>
                </Card.Body>
            </Card>
        )
    }

}