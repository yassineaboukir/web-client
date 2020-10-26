import Ipv4Link from '../ui/Ipv4Link'
import UserRoleBadge from '../badges/UserRoleBadge'
import UserLink from "../users/Link";
import Timestamps from '../ui/Timestamps';
import Badge from '../badges/Badge';

export default function AuditLogsTable({auditLog, hideUserColumns = false}) {
    return (
        <table >
            <thead>
            <tr>
                <th>Action</th>
                <th>IP address</th>
                <th>Timestamps</th>
                {!hideUserColumns &&
                <>
                    <th>User</th>
                    <th>Role</th>
                </>
                }
                <th>Object</th>
            </tr>
            </thead>
            <tbody>
            {auditLog.map((entry, index) => {
                return (
                    <tr key={index}>
                        <td>
                            <Badge>{entry.action}</Badge>
                        </td>
                        <td>
                            <Timestamps insertTs={entry.insert_ts}/>
                        </td>
                        
                        <td><Ipv4Link value={entry.client_ip}/></td>
                        {!hideUserColumns &&
                        <>
                            <td><UserLink userId={entry.user_id}>{entry.name}</UserLink></td>
                            <td><UserRoleBadge role={entry.role}/></td>
                        </>
                        }
                        <td>{entry.object}</td>
                    </tr>
                )
            })}
            </tbody>
        </table>
    )
}
