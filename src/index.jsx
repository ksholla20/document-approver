import ForgeUI, {
  Badge,
  Button,
  render,
  Fragment,
  Macro,
  MacroConfig,
  Text,
  TextField,
  useConfig,
  useEffect,
  useState,
  useProductContext,
  Table,
  Head,
  Cell,
  Row
 } from "@forge/ui";
import api, { properties, route } from '@forge/api';

const defaultConfig = {
  approvers: "",
};
const Config = () => {
  return (
    <MacroConfig>
      <TextField
        name="approvers"
        label="Comma Separated list of approvers"
        defaultValue={defaultConfig.approvers}
      />
    </MacroConfig>
  );
};


const App = () => {
  const {approvers} = useConfig() || defaultConfig;
  const { contentId } = useProductContext();
  const approverList = approvers.split(",");
  const [approvalStatus, setApprovalStatus] = useState(async () => {
    const status =
      (await properties.onConfluencePage(contentId).get("approvalStatus")) || {};
    return status;
  });
  const [currentUser, setCurrentUser] = useState(async () => {
    const user = await api.asUser().requestConfluence(route`/wiki/rest/api/user/current`);
    return user.json();
  });
  const [lastUpdated, setLastUpdated] = useState(async () => {
    const history = await api.asApp().requestConfluence(route`/wiki/rest/api/content/${contentId}/history`);
    return history.json();
  });
  const [approverMap, setApproverMap] = useState({});
  useEffect(() => {
    const getApprovers = async () => {
      let approvers = {};
      await approverList.forEach(async (approverId) => {
        const approver = await api.asUser().requestConfluence(route`/wiki/rest/api/user?accountId=${approverId}`).json();
        approvers[approverId] = approver.displayName;
      })
      return approvers;
    }
    getApprovers().then(approvers => {
      setApproverMap(approvers);
    })
  }, [approverList]);
  

  const setApproval = async(approver, isApproved) => {
    const status = approvalStatus;
    status[approver]={'isApproved': isApproved, 'lastUpdated': new Date().toString()};
    await properties
      .onConfluencePage(contentId)
      .set("approvalStatus", status)
      .then(() => setApprovalStatus(status));
  };

  return (
    <Fragment>
      <Table>
        <Head>
          <Cell>
            <Text content="Approver" />
          </Cell>
          <Cell>
            <Text content="Status" />
          </Cell>
        </Head>
        {approverList && approverList.map(approver => (
                <Row>
                  <Cell>
                    <Text>
                      {approverMap[approver]}
                    </Text>
                  </Cell>
                  <Cell>
                      {approvalStatus[approver]
                        && approvalStatus[approver].isApproved
                        && Date.parse(approvalStatus[approver].lastUpdated) >= Date.parse(lastUpdated.lastUpdated.when)
                        && <Text><Badge appearance="added" text="Approved" /> </Text>}
                      {approvalStatus[approver]
                        && approvalStatus[approver].isApproved
                        && Date.parse(approvalStatus[approver].lastUpdated) < Date.parse(lastUpdated.lastUpdated.when)
                        && <Text><Badge appearance="primary" text="Approved but modified" /> </Text>}
                      {!(approvalStatus[approver]
                        && approvalStatus[approver].isApproved)
                        && <Text><Badge appearance="removed" text="Not Approved" /> </Text>}
                  </Cell>
                  {
                  currentUser.accountId==approver &&
                  <Cell>
                      <Button text={(approvalStatus[approver]&&approvalStatus[approver].isApproved)?"unapprove":"approve"} onClick={()=>setApproval(approver, !(approvalStatus[approver]&&approvalStatus[approver].isApproved))}></Button>
                  </Cell>
                  }
                </Row>
              ))}
      </Table>
     </Fragment>
  );
};

export const run = render(
  <Macro
    app={<App />}
  />
);
export const config = render(<Config />);
