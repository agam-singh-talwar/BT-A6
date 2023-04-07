import { addToHistory } from "@/lib/userData";
import { Form, Row, Col, Button, } from "react-bootstrap"
import { useAtom } from "jotai";
import { searchHistoryAtom } from "@/store";
import { useRouter } from "next/router";
import { useForm } from 'react-hook-form';

export default function AdvancedSearch() {
    const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom)
    const router = useRouter();
    let err = "error"
    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        defaultValues: {
            searchBy: "title",
            geoLocation: "",
            medium: "",
            isOnView: false,
            isHighlight: false,
            q: "",
        }
    });
    async function submitForm(data) {
        let queryString = ""
        queryString += data.searchBy + "=true"
        if (data.geoLocation) {
            queryString += "&geoLocation=" + data.geoLocation;
        }
        if (data.medium) {
            queryString += "&medium=" + data.medium;
        }
        queryString += "&isOnView=" + data.isOnView;
        queryString += "&isHighlight=" + data.isHighlight;
        queryString += "&q=" + data.q;
        if (queryString !== "") {
            router.push(`/artwork?${queryString}`);
            // setSearchHistory(current => [...current, queryString]);
            setSearchHistory(await addToHistory(queryString))
        }
        else {
            errors.q = "Please enter a search query";
        }
    }
    return (
        <>
            <Form onSubmit={handleSubmit(submitForm)}>
                <Row>
                    <Col>
                        <Form.Group className="mb-3">
                            <Form.Label>Search Query</Form.Label>
                            <Form.Control {...register("q", { required: true })} type="text" placeholder="" className={errors.q ? "is-invalid" : ""} name="q" />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col md={4}>
                        <Form.Label>Search By</Form.Label>
                        <Form.Select name="searchBy" {...register("searchBy")} className="mb-3">
                            <option value="title">Title</option>
                            <option value="tags">Tags</option>
                            <option value="artistOrCulture">Artist or Culture</option>
                        </Form.Select>
                    </Col>
                    <Col md={4}>
                        <Form.Group className="mb-3">
                            <Form.Label>Geo Location</Form.Label>
                            <Form.Control {...register("geoLocation")} type="text" placeholder="" name="geoLocation" />
                            <Form.Text className="text-muted">
                                Case Sensitive String (ie &quot;Europe&quot;, &quot;France&quot;, &quot;Paris&quot;, &quot;China&quot;, &quot;New York&quot;, etc.), with multiple values separated by the | operator
                            </Form.Text>
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group className="mb-3">
                            <Form.Label>Medium</Form.Label>
                            <Form.Control {...register("medium")} type="text" placeholder="" name="medium" />
                            <Form.Text className="text-muted">
                                Case Sensitive String (ie: &quot;Ceramics&quot;, &quot;Furniture&quot;, &quot;Paintings&quot;, &quot;Sculpture&quot;, &quot;Textiles&quot;, etc.), with multiple values separated by the | operator
                            </Form.Text>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Check {...register("isHighlight")}
                            type="checkbox"
                            label="Highlighted"
                            name="isHighlight"
                        />
                        <Form.Check  {...register("isOnView")}
                            type="checkbox"
                            label="Currently on View"
                            name="isOnView"
                        />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <br />
                        <Button variant="primary" type="submit" onSubmit={submitForm}>
                            Submit
                        </Button>
                    </Col>
                </Row>
            </Form>
        </>
    )
}