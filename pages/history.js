import { useAtom } from "jotai"
import { removeFromHistory } from "@/lib/userData";
import { searchHistoryAtom } from "@/store"
import { useRouter } from "next/router";
import styles from '@/styles/History.module.css';
import { Card, ListGroup, Button } from "react-bootstrap";

export default function History() {
    const router = useRouter();
    const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom)
    if (!searchHistory) return null;

    let parsedHistory = [];
    searchHistory.forEach(h => {
        let params = new URLSearchParams(h);
        let entries = params.entries();
        parsedHistory.push(Object.fromEntries(entries));
    });

    const historyClicked = (e, index) => {
        router.push(`/artwork?${searchHistory[index]}`);
    }
    const removeHistoryClicked = async (e, index) => {
        e.stopPropagation(); // stop the event from trigging other events
        setSearchHistory(await removeFromHistory(searchHistory[index]))
        // setSearchHistory(current => {
        //     let x = [...current];
        //     x.splice(index, 1)
        //     return x;
        // });
    }
    if (parsedHistory != null || parsedHistory != undefined) {
        return (
            <>
                <br />
                {parsedHistory.length > 0 ? parsedHistory.map((item, index) => (
                    <>
                        <br />
                        <ListGroup.Item key={index} className={styles.historyListItem} onClick={e => historyClicked(e, index)}>
                            {Object.keys(item).map((key) => (
                                <span key={key}>
                                    {key}: <strong>{item[key]}</strong>&nbsp;
                                </span>
                            ))}
                            <Button className="float-end" variant="danger" size="sm"
                                onClick={e => removeHistoryClicked(e, index)}>&times;</Button>

                        </ListGroup.Item>
                    </>
                )) : <Card className='text-center'><br /><h4>Nothing Here</h4><p>Try searching for some Artwork</p><br /></Card>
                }
            </>
        );
    }
}