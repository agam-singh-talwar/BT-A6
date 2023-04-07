import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { favouritesAtom, searchHistoryAtom } from '@/store';
import { isAuthenticated } from '../lib/authenticate';
import { getFavourites, getHistory } from '@/lib/userData';
import { useAtom, updateAtom } from 'jotai';
import { Card, Form, Alert, Button } from 'react-bootstrap';


export default function RouteGuard(props) {
    const PUBLIC_PATHS = ['/login', '/', '/_error', '/register'];
    const router = useRouter();
    const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);
    const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);
    const [authorized, setAuthorized] = useState(false);

    // then use it like this
    async function updateAtoms() {
        setFavouritesList(await getFavourites());
        setSearchHistory(await getHistory());
    }
    useEffect(() => {
        updateAtoms();
        // on initial load - run auth check 
        authCheck(router.pathname);

        // on route change complete - run auth check 
        router.events.on('routeChangeComplete', authCheck)

        // unsubscribe from events in useEffect return function
        return () => {
            router.events.off('routeChangeComplete', authCheck);
        }

    }, []);

    function authCheck(url) {
        // redirect to login page if accessing a private page and not logged in 
        const path = url.split('?')[0];
        if (!isAuthenticated() && !PUBLIC_PATHS.includes(path)) {
            setAuthorized(false);
            router.push("/login");
        } else {
            setAuthorized(true);
        }
    }


    function Login(props) {

        const [warning, setWarning] = useState("");
        const [user, setUser] = useState("");
        const [password, setPassword] = useState("");
        const router = useRouter();
        const [FavouritesList, setFavouritesList] = useAtom(favouritesAtom);
        const [SearchHistory, setSearchHistory] = useAtom(searchHistoryAtom);

        async function updateAtoms() {
            setFavouritesList(await getFavourites());
            setSearchHistory(await getHistory());
        }
        async function handleSubmit(e) {
            e.preventDefault();

            try {
                await authenticateUser(user, password);
                await updateAtoms();
                router.push("/favorites");
            } catch (err) {
                setWarning(err.message);
            }

        }

        return (
            <>
                <Card bg="light">
                    <Card.Body>
                        <h2>Login</h2>
                        Enter your login information below:
                    </Card.Body>
                </Card>

                <br />

                <Form onSubmit={handleSubmit}>
                    <Form.Group >
                        <Form.Label>User:</Form.Label>
                        <Form.Control type="text" value={user} id="userName" name="userName" onChange={e => setUser(e.target.value)} />
                    </Form.Group>
                    <br />
                    <Form.Group>
                        <Form.Label>Password:</Form.Label>
                        <Form.Control type="password" value={password} id="password" name="password" onChange={e => setPassword(e.target.value)} />
                    </Form.Group  >

                    {warning && <>
                        <br />
                        <Alert variant='danger'>
                            {warning}
                        </Alert>
                    </>}

                    <br />
                    <Button variant="primary" className="pull-right" type="submit">Login</Button>
                </Form>
            </>
        );
    }

    return (
        <>
            {authorized && props.children}
        </>
    )
}