import React, { useCallback, useEffect, useState } from 'react'
import useSetTitle from './../../hooks/useSetTitle'
import Loading from '../ui/Loading';
import useDelete from '../../hooks/useDelete';
import Pagination from '../layout/Pagination';
import secureApiFetch from '../../services/api';
import VulnerabilitiesTable from './VulnerabilitiesTable';
import CreateButton from '../ui/buttons/Create';
import Title from '../ui/Title';
import { IconFlag } from '../ui/Icons';
import Breadcrumb from "../ui/Breadcrumb";

const VulnerabilitiesList = ({ history }) => {
    const searchParams = new URLSearchParams(history.location.search);
    let pageNumber = searchParams.get('page');
    pageNumber = pageNumber !== null ? parseInt(pageNumber) : 1;
    const apiPageNumber = pageNumber - 1;

    useSetTitle(`Vulnerabilities - Page ${pageNumber}`)

    const [vulnerabilities, setVulnerabilities] = useState([]);
    const [numberPages, setNumberPages] = useState(1);

    const handlePrev = () => {
        history.push(`/vulnerabilities?page=${pageNumber - 1}`);
    }
    const handleNext = () => {
        history.push(`/vulnerabilities?page=${pageNumber + 1}`);
    }

    const reloadData = useCallback(() => {
        secureApiFetch(`/vulnerabilities?page=${apiPageNumber}`, { method: 'GET' })
            .then(resp => {
                if (resp.headers.has('X-Page-Count')) {
                    setNumberPages(resp.headers.get('X-Page-Count'))
                }
                return resp.json()
            })
            .then((data) => {
                setVulnerabilities(data);
            })
    }, [apiPageNumber]);

    useEffect(() => {
        reloadData()
    }, [reloadData])

    const destroy = useDelete('/vulnerabilities/', reloadData, 'Do you really want to delete this vulnerability?', 'The vulnerability has been deleted.');
    const handleCreateVulnerability = () => {
        history.push(`/vulnerabilities/create`)
    }

    return (
        <>
            <div className='heading'>
                <Breadcrumb />
                <Pagination page={apiPageNumber} total={numberPages} handlePrev={handlePrev} handleNext={handleNext} />
                <CreateButton onClick={handleCreateVulnerability}>Add vulnerability</CreateButton>
            </div>
            <Title title='Vulnerabilities' icon={<IconFlag />} />
            {!vulnerabilities ? <Loading /> :
                <VulnerabilitiesTable vulnerabilities={vulnerabilities} destroy={destroy} />
            }
        </>
    )
}

export default VulnerabilitiesList
