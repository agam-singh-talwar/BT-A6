import validObjectIDList from "@/public/data/validObjectIDList.json"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Error from 'next/error';
import useSWR from 'swr';
import Card from 'react-bootstrap/Card';
import Pagination from 'react-bootstrap/Pagination';
import ArtworkCard from '@/components/ArtworkCard';

const PER_PAGE = 12
const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Artwork() {
    const [artworkList, setArtworkList] = useState([])
    const [page, setPage] = useState(1)

    const router = useRouter();
    let finalQuery = router.asPath.split('?')[1];
    const { data, error } = useSWR(`https://collectionapi.metmuseum.org/public/collection/v1/search?${finalQuery}`, fetcher);

    function nextPage(e) {
        if (page < artworkList.length) {
            setPage(page => (page += 1))
        }
    }
    function previousPage(e) {
        if (page > 1) {
            setPage(page => (page -= 1))
        }
    }
    useEffect(() => {
        if (data != null && data != undefined) {
            console.log(data)
            let filteredResults = validObjectIDList.objectIDs.filter(x => data.objectIDs?.includes(x));
            var results = []
            for (let i = 0; i < filteredResults.length; i += PER_PAGE) {
                const chunk = filteredResults.slice(i, i + PER_PAGE);
                results.push(chunk);
            }
            setArtworkList(results);
            setPage(1)
        }

    }, [data])

    if (error) {
        return <Error statusCode={404} />
    }
    if (artworkList != null && artworkList != undefined) {
        return (<>
            <Row className="gy-4">
                {artworkList.length > 0 ? artworkList[page - 1]?.map((currentObjectID) => (
                    <Col lg={3} key={currentObjectID}><ArtworkCard objectID={currentObjectID} /></Col>
                )) : <Card className='text-center'><br /><h4>Nothing Here</h4><p>Try searching for something else</p><br /></Card>}
            </Row>
            {artworkList.length > 0 ? (
                <Row>
                    <Col>
                        <Pagination>
                            <Pagination.Prev onClick={(e) => { previousPage(e) }} />
                            <Pagination.Item>{page}</Pagination.Item>
                            <Pagination.Next onClick={(e) => { nextPage(e) }} />
                        </Pagination>
                    </Col>
                </Row>
            ) : null}
        </>)
    }
    else { return null }
}