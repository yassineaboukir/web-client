import TimestampsSection from 'components/ui/TimestampsSection';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';
import useDelete from '../../hooks/useDelete';
import useFetch from '../../hooks/useFetch';
import useSetTitle from '../../hooks/useSetTitle';
import secureApiFetch from '../../services/api';
import Breadcrumb from '../ui/Breadcrumb';
import ButtonGroup from "../ui/buttons/ButtonGroup";
import DeleteButton from "../ui/buttons/Delete";
import PrimaryButton from '../ui/buttons/Primary';
import { IconPlusCircle } from '../ui/Icons';
import Loading from '../ui/Loading';
import Title from '../ui/Title';

const TemplateDetails = ({ history, match }) => {
    useSetTitle('Projects templates');
    const [template, updateTemplate] = useFetch(`/projects/${match.params.id}`)
    const [tasks] = useFetch(`/projects/${match.params.id}/tasks`)

    const cloneProject = async (templateId) => {
        secureApiFetch(`/projects/${templateId}/clone`, { method: 'POST' })
            .then(resp => resp.json())
            .then(data => {
                history.push(`/projects/${data.projectId}/edit`);
            });
    }

    const destroy = useDelete('/tasks/', updateTemplate);

    return (
        <>
            <div className='heading'>
                <Breadcrumb>
                    <Link to="/templates">Templates</Link>
                </Breadcrumb>
                {template &&
                    <ButtonGroup>
                        <PrimaryButton onClick={() => cloneProject(template.id)}><IconPlusCircle
                        /> Create
                        project from template</PrimaryButton>
                        <DeleteButton onClick={() => destroy(template.id)} />
                    </ButtonGroup>
                }
            </div>
            {(!template) ?
                <Loading /> :
                <article>
                    <Title title={template.name} type='Project template' />

                    <div className="flex">
                        <div className="half">
                            <h4>Description</h4>
                            <ReactMarkdown>{template.description}</ReactMarkdown>
                            <h4>Tasks</h4>
                            <ol>
                                {tasks && tasks.map((task, index) =>
                                    <li key={index}>
                                        <Link to={"/tasks/" + task.id}>{task.name}</Link>
                                    </li>
                                )}
                            </ol>
                        </div>

                        <div className="push-right">
                            <TimestampsSection entity={template} />
                        </div>
                    </div>
                </article>}
        </>
    )
}

export default TemplateDetails
