const ORG = 'https://github.com/plazofiscal-devops';
const REPO = `${ORG}/plazofiscal-platform`;
const BLOB = `${REPO}/blob/main`;

export const links = {
  org: ORG,
  repo: REPO,
  business: `${BLOB}/docs/business-case.md`,
  architecture: `${BLOB}/docs/architecture.md`,
  operations: `${BLOB}/docs/operations.md`,
  evidence: `${BLOB}/docs/evidence.md`,
  issues: `${REPO}/issues?q=is%3Aissue`,
  pulls: `${REPO}/pulls?q=is%3Apr`
};

export const metrics = [
  { n: 9272, l: 'requests during four releases', s: 'none failed, p95 under 16 ms' },
  { n: 31, l: 'network paths proven', s: 'from the real pods, on every run' },
  { n: 4, pre: '2 → ', l: 'replicas under load', s: 'and 3 when a filing window opens' },
  { n: 2, pre: '< ', u: ' min', l: 'from an outage to Slack', s: 'one alert rule of our own' },
  { n: 12, l: 'recorded demonstrations', s: 'of the live platform' }
];

export const facts = [
  ['Dozens', 'of clients per firm, each with dates that depend on its tax id'],
  ['4 taxes', 'VAT, withholding, income tax and ICA fall due on different dates'],
  ['1 missed date', 'is a penalty for the client and a lost client for the firm']
];

export const objectives = [
  ['99.5 %', 'successful requests during a filing window'],
  ['< 500 ms', 'for 95 % of requests, since accountants work through long lists'],
  ['0', 'failed requests during a release, which cannot wait for a quiet month']
];

// Load phases of the business case, used by the calendar
export const phases = {
  quiet: { name: 'Quiet days', rps: 5, replicas: 2, note: 'Days 1 to 7 and 25 to 31. Two replicas of each served service, the minimum.' },
  window: { name: 'Monthly filing window', rps: 15, replicas: 3, note: 'From 07:00 on day 8 to 20:00 on day 24, Bogotá time. KEDA raises each served service to 3 replicas before the first accountant arrives.' },
  season: { name: 'Income tax season', rps: 30, replicas: 4, note: 'From August 1 to October 31. KEDA holds 4 replicas, the most the nodes can fit.' }
};

export const services = [
  ['frontend', 'Vue 2 · nginx', 'The Spanish screen of the accountant, obligations by due date and a calendar'],
  ['auth-api', 'Go', 'Application sign-in, signs a JWT'],
  ['users-api', 'Java 8 · Spring Boot', 'Application users in a seeded in-memory database'],
  ['todos-api', 'Node.js 20 · Express', 'Obligations in Redis, and business metrics on /metrics'],
  ['log-message-processor', 'Python 3.11', 'Receives each action through a Redis channel and records it'],
  ['Redis', '7 · StatefulSet', 'Obligations of each user, on a persistent volume']
];

export const overview = [
  'Each served service rolls out with one extra pod and none fewer',
  'plazofiscal starts from default deny, and Redis keeps its data on a persistent volume',
  'KEDA scales by CPU and by the filing calendar',
  'Kubecost reads the same Prometheus and runs on demand',
  'Fluent Bit, Logstash, Elasticsearch and Kibana carry logs and events',
  'Keycloak with an authenticator code stands in front of everything',
  'Grafana opens on the PlazoFiscal dashboard with the five signals'
];

export const stack = [
  ['Cluster', 'k3d and K3s', 'v1.36.6', 'One server and two agents as containers, capped at 10 GiB'],
  ['Entry', 'Traefik', '3.7.17', 'One name per tool under plazofiscal.localhost:8000'],
  ['Identity', 'Keycloak', '26.8.2', 'Password and TOTP code for every user'],
  ['Identity', 'oauth2-proxy', 'chart 10.7.2', 'Session gate that Traefik asks before each route'],
  ['Scaling', 'KEDA', '2.21.0', 'Adds the filing calendar to the CPU of the HPA'],
  ['Metrics and alerts', 'kube-prometheus-stack', '93.1.0', 'Prometheus, Alertmanager, Grafana and exporters'],
  ['Costs', 'Kubecost', '2.8.7', 'Cost by namespace and service, started on demand'],
  ['Logs', 'ECK and Elastic', '3.5.0 · 9.5.6', 'Elasticsearch, Logstash and Kibana run by their operator'],
  ['Logs and events', 'Fluent Bit', '5.1.3', 'A DaemonSet for logs and one replica for events'],
  ['Traces', 'Jaeger', '2.19.0', 'Receives Zipkin spans and keeps them in memory'],
  ['Load', 'k6', '2.3.0', 'Accountant traffic as a Job inside the cluster'],
  ['Review', 'GitHub Actions', 'CI', 'kustomize, gitleaks, checkov, actionlint and zizmor on every pull request']
];

// Memory measured with kubectl top on the reference machine, in GiB
export const memory = [
  ['Logstash and Kibana', 1.6],
  ['Application at maximum replicas', 1.1],
  ['Elasticsearch', 1.0],
  ['Prometheus, Alertmanager and Grafana', 1.0],
  ['Kubernetes on three nodes', 0.8],
  ['Kubecost, on demand', 0.75],
  ['Keycloak and oauth2-proxy', 0.6],
  ['Traefik and KEDA', 0.3],
  ['Jaeger and Fluent Bit', 0.05]
];

export const measures = [
  ['Kubecost on demand', 'It starts with make costs-on for a cost review and stops with make costs-off.'],
  ['Pods pinned to agents', 'Keycloak, Grafana and Elasticsearch run on the agents, which leaves the server for the control plane.'],
  ['A capped Java heap', 'users-api went from 1.0 to 0.27 GiB with its heap at 192 MiB, since Java 8 sized it from the node.']
];

export const rollSteps = [
  ['maxSurge 1 creates one extra pod', ['v1', 'v1', 'v2*']],
  ['The readiness probe lets it receive traffic', ['v1', 'v1', 'v2']],
  ['An old pod leaves, waits 5 s in preStop and handles SIGTERM', ['v1', 'v2', 'v1x']],
  ['It repeats until the last pod, and an undo takes the same path', ['v2', 'v2']]
];

export const strategies = [
  ['Recreate', 'Stops everything and starts the new version. It cuts the service, which a filing window cannot accept.', false],
  ['Rolling update', 'Native to the Deployment, with no extra resources. The strategy assigned to the group, enough with readiness, a disruption budget and preStop.', true],
  ['Blue/green', 'Two full versions and a Service switch. It doubles memory on a machine with 10 GiB of nodes.', false],
  ['Canary', 'A share of traffic to the new version through Argo Rollouts or Flagger. It adds a controller and metric analysis.', false]
];

// Each line is [text, marker, kind], kind h highlights and c dims
export const code = {
  rolling: { file: 'deploy/app/todos-api.yaml', lines: [
    ['spec:'], ['  strategy:'], ['    type: RollingUpdate'], ['    rollingUpdate:'],
    ['      maxSurge: 1', 1], ['      maxUnavailable: 0', 0, 'h'],
    ['  template:'], ['    spec:'], ['      topologySpreadConstraints:'],
    ['        - maxSkew: 1', 2], ['          topologyKey: kubernetes.io/hostname', 0, 'h'],
    ['      containers:'], ['        - readinessProbe:'],
    ['            httpGet: { path: /ready, port: 8082 }', 3],
    ['          lifecycle:'], ['            preStop:'], ['              sleep: { seconds: 5 }', 4],
    ['---  # deploy/app/disruption-budgets.yaml', 0, 'c'],
    ['kind: PodDisruptionBudget'], ['spec: { maxUnavailable: 1 }', 5]
  ] },
  policy: { file: 'deploy/policies/network-policies.yaml', lines: [
    ['kind: NetworkPolicy'], ['metadata: { name: default-deny }'], ['spec:'],
    ['  podSelector: {}', 1], ['  policyTypes: [Ingress, Egress]', 0, 'h'],
    ['---'], ['kind: NetworkPolicy'], ['metadata: { name: allow-frontend-from-ingress }'], ['spec:'],
    ['  podSelector:'], ['    matchLabels: { app: frontend }', 2],
    ['  ingress:'], ['    - from:'], ['        - namespaceSelector:'], ['            matchLabels:'],
    ['              kubernetes.io/metadata.name: ingress', 3], ['      ports: [{ protocol: TCP, port: 8080 }]', 0, 'h']
  ] },
  keda: { file: 'deploy/autoscaling/scaled-objects.yaml', lines: [
    ['kind: ScaledObject'], ['spec:'], ['  scaleTargetRef: { name: frontend }'],
    ['  minReplicaCount: 2', 1], ['  maxReplicaCount: 4', 0, 'h'],
    ['  triggers:'], ['    - type: cpu', 2], ['      metricType: Utilization'], ['      metadata: { value: "65" }', 0, 'h'],
    ['    # Monthly filing window', 0, 'c'],
    ['    - type: cron', 3], ['      metadata:'], ['        timezone: America/Bogota'],
    ['        start: "0 7 8 * *"', 0, 'h'], ['        end: "0 20 24 * *"', 0, 'h'], ['        desiredReplicas: "3"', 0, 'h'],
    ['    # Income tax season', 0, 'c'],
    ['    - type: cron', 4], ['      metadata:'], ['        timezone: America/Bogota'],
    ['        start: "0 7 1 8 *"', 0, 'h'], ['        end: "0 20 31 10 *"', 0, 'h'], ['        desiredReplicas: "4"', 0, 'h']
  ] },
  alert: { file: 'deploy/monitoring/alert-rules.yaml, simplified', lines: [
    ['kind: PrometheusRule'], ['spec:'], ['  groups:'], ['    - name: plazofiscal'], ['      rules:'],
    ['        - alert: PlazoFiscalServiceDown', 1], ['          expr: |'],
    ['            kube_deployment_status_replicas_available'], ['              {namespace="plazofiscal"} == 0'],
    ['            or kube_statefulset_status_replicas_ready'], ['              {namespace="plazofiscal"} == 0'],
    ['          for: 1m', 2], ['          labels: { severity: critical }', 0, 'h']
  ] },
  logstash: { file: 'deploy/platform/elastic/logstash.yaml, simplified', lines: [
    ['filter {'], ['  if [kubernetes][labels][app] {'],
    ['    mutate { copy => {', 3], ['      "[kubernetes][labels][app]" => "[service][name]" } }', 0, 'h'], ['  }'],
    ['  if [app][status] >= 500 {', 4], ['    mutate { add_field => { "[log][level]" => "ERROR" } }', 0, 'h'], ['  }'],
    ['  if [message] =~ /GET \\/(health|ready)/ { drop {} }', 5], ['}']
  ] },
  signin: { file: 'deploy/platform/oauth2-proxy/middlewares.yaml', lines: [
    ['kind: Middleware'], ['metadata: { name: require-platform, namespace: identity }'], ['spec:'], ['  forwardAuth:'],
    ['    address: http://oauth2-proxy.identity.svc'], ['             /oauth2/auth?allowed_groups=plataforma', 1],
    ['---  # deploy/ingress/routes.yaml', 0, 'c'],
    ['kind: IngressRoute'], ['spec:'], ['  routes:'],
    ['    - match: Host(`app.plazofiscal.localhost`)'], ['             && Header(`Sec-Fetch-Mode`, `navigate`)', 2],
    ['      middlewares:'], ['        - { name: sign-in, namespace: identity }', 3], ['        - { name: require-user, namespace: identity }', 0, 'h'],
    ['      services:'], ['        - { name: frontend, namespace: plazofiscal, port: 8080 }']
  ] },
  realm: { file: 'deploy/platform/keycloak/realm.json, excerpt', lines: [
    ['"otpPolicyType": "totp",', 4], ['"otpPolicyDigits": 6,'], ['"otpPolicyPeriod": 30,'],
    ['"bruteForceProtected": true,', 0, 'h'], ['"requiredActions": ["CONFIGURE_TOTP"]', 0, 'h']
  ] }
};

export const rollingNotes = [
  ['One extra, none fewer', 'A new pod starts first and only then an old one leaves, so capacity never drops.'],
  ['Replicas on different nodes', 'The two replicas spread by node, so a lost node does not take the service.'],
  ['Traffic only when ready', '/ready asks Redis, and the Service sends requests once it answers.'],
  ['An orderly exit', 'preStop waits 5 s while Kubernetes drops the pod from the endpoints, then the process handles SIGTERM.'],
  ['Drains keep a minimum', 'A node drain removes at most one pod of each service at a time.']
];

export const runs = [
  ['todos-api in 37 s, then frontend in 57 s', '4,117', '0', '15.9 ms'],
  ['auth-api in 36 s, then users-api in 83 s', '5,155', '0', '12.8 ms'],
  ['frontend, before the fix', '4,151', '6', 'n/a']
];

export const paths = [
  ['Traefik', 'frontend', '8080'],
  ['frontend', 'auth-api and todos-api', '8081, 8082'],
  ['auth-api', 'users-api', '8083'],
  ['todos-api and processor', 'Redis', '6379'],
  ['Prometheus', 'todos-api /metrics', '8082'],
  ['every pod', 'trace collector', '9411'],
  ['every pod', 'cluster DNS', '53']
];

export const policyNotes = [
  ['Everything closed', 'An empty selector takes every pod of plazofiscal and denies it ingress and egress.'],
  ['Who receives', 'Each policy opens one service, here the frontend.'],
  ['From where and to which port', 'Only the Traefik namespace reaches port 8080 of the frontend.']
];

export const policyTest = [
  'Opens every allowed path from the real pods with kubectl exec.',
  'Each denied path targets a port that an allowed path reaches, so a refusal can only come from a policy.',
  'Probe pods in default, ingress and observability test from outside.',
  'Exits with an error when any path behaves differently from what the policies declare.'
];

export const redis = [
  ['12 s', 'for the Redis pod to come back, on the node that holds its volume'],
  ['Same list', 'of obligations before and after the restart'],
  ['1 of 2,031', 'requests failed during the restart, the one in flight, and the rest waited up to 4.1 s']
];

export const scaleRules = [
  ['Always', '2, the minimum'],
  ['Monthly window, 07:00 on day 8 to 20:00 on day 24', '3'],
  ['Income tax season, August 1 to October 31', '4'],
  ['CPU above 65 % of the request', 'up to 4']
];

export const scaleAlternatives = [
  ['HPA on CPU only', 'It reacts after load rises and cannot anticipate day 8 or the income tax season.', false],
  ['A CronJob that edits the HPA', 'It needs permission to change cluster objects and duplicates the logic of the HPA.', false],
  ['KEDA with cron and CPU', 'One short declarative object per service, with no extra permissions, and the HPA combines both triggers.', true],
  ['More nodes or high fixed replicas', 'They pay for capacity all month for a peak of seventeen days.', false]
];

export const kedaNotes = [
  ['Floor and ceiling', 'Two replicas always, and four as the ceiling the memory of the nodes allows.'],
  ['Real load', 'The HPA adds replicas when CPU passes 65 % of the request.'],
  ['Monthly window', 'At 07:00 on day 8 it asks for 3, and at 20:00 on day 24 it lets go.'],
  ['Income tax season', 'From August to October it holds 4 replicas.']
];

export const scaleProof = [
  { n: 4, pre: '2 → ', l: 'replicas in about 60 s', s: 'for frontend and todos-api at 70 requests per second' },
  { n: 0, l: 'failed requests at 92 req/s', s: 'with every scaled service at 4 replicas and no pod waiting' },
  { n: 3, pre: '2 → ', l: 'replicas as a window opened', s: 'and back to 2 five minutes after it closed' }
];

export const signals = [
  ['Metrics', 'Prometheus keeps 7 days, and todos-api publishes the business metrics.'],
  ['Logs', 'Fluent Bit on each node, then Logstash, and Elasticsearch keeps 3 days.'],
  ['Events', 'Another Fluent Bit replica reads them from the Kubernetes API.'],
  ['Traces', 'Zipkin spans from the five services to Jaeger.'],
  ['Alerts', 'Prometheus rules, Alertmanager and Slack.']
];

export const timeline = [
  ['08:04:20', 'users-api goes to 0 replicas'],
  ['08:05:01', 'the rule PlazoFiscalServiceDown is pending'],
  ['08:06:01', 'it fires after 1 minute'],
  ['08:06:42', 'the message is in Slack'],
  ['08:06:42', 'users-api is back to 1 replica'],
  ['08:11:35', 'the resolved message arrives, at the next group interval']
];

export const obsNotes = [
  ['No ready replica', 'Any Deployment or StatefulSet of plazofiscal with zero ready replicas.'],
  ['One minute of grace', 'It fires after a minute, and Alertmanager posts it to Slack.'],
  ['Service name', 'Taken from the app label of the pod, which Fluent Bit attaches.'],
  ['Log level', 'The HTTP status gives ERROR from 500 and WARN from 400.'],
  ['No noise', 'Health probes are dropped before Elasticsearch.']
];

export const dashboard = [
  'Obligations registered in the last 24 hours',
  'Overdue obligations, by the date in Bogotá',
  'Obligations due in the next 7 days',
  'Filing window open or closed, read from KEDA',
  'Registrations by tax',
  'Stored obligations by state and tax',
  'Sign-ins by result, from the logs of auth-api',
  'Health, with requests, p95 latency, replicas and CPU'
];

export const costAlternatives = [
  ['Kubecost 2.8', 'Reads Prometheus, one pod of about 0.5 to 0.75 GiB, started on demand with make costs-on.', true],
  ['Kubecost 3', 'Replaced Prometheus with ClickHouse. Its aggregator asks for 3 GiB and the vendor recommends 8 GB.', false],
  ['OpenCost', 'The open source base of Kubecost, without its interface. The fallback if 2.8 stops working.', false]
];

export const signinSteps = [
  'The browser asks Traefik for a tool',
  'Traefik asks oauth2-proxy whether a session exists',
  'With no session, it redirects to Keycloak',
  'Keycloak asks for the password',
  'and for the code of the authenticator app',
  'Back at oauth2-proxy, which sets the cookie',
  'Traefik lets the request through, and Grafana signs in with OIDC',
  'Another group sees the page Sin acceso'
];

export const signinNotes = [
  ['A group for the tools', 'Grafana, Kibana, Jaeger and the rest require the group plataforma.'],
  ['Page navigations only', 'A page with no session goes to Keycloak, while a favicon or an API call gets 401.'],
  ['From 401 to Keycloak', 'sign-in turns the 401 into a redirect, and require-user checks the cookie.'],
  ['A six digit code', 'TOTP every 30 s, required from the first sign-in, with brute force protection.']
];

export const roles = [
  ['operador', 'group plataforma', 'Opens every tool and the application'],
  ['contador', 'group contadores', 'Opens the application only']
];

export const steps = [
  ['Card', 'An issue with its done criterion, taken in dependency order.'],
  ['Plan', 'Analysis, decisions with their alternatives and verifiable subtasks before any code.'],
  ['Branch', 'One branch per card, with commits in Conventional Commits.'],
  ['Pull request', 'The measured evidence in the description and every check green.'],
  ['Merge and close', 'Squash into main, and the issue closes with a delivery comment.']
];

export const cards = [
  [1, [12], 'Run the platform from a clean clone'],
  [2, [13], 'Move obligations to Redis'],
  [11, [14], 'Adapt the frontend to tax obligations'],
  [3, [15], 'Deploy the application with rolling updates'],
  [4, [16], 'Network policies and persistent storage'],
  [5, [17], 'Autoscaling by load and date'],
  [6, [18, 19], 'Metrics, alerts and costs'],
  [7, [20], 'Logs, traces and events'],
  [8, [21, 22], 'Sign-in with SSO and MFA'],
  [9, [23], 'Business dashboard'],
  [10, [24], 'Documentation and diagrams']
];

export const checks = [
  ['Manifests', 'kustomize renders every deployment folder'],
  ['Secrets', 'gitleaks scans the whole history, its binary verified by checksum'],
  ['Kubernetes', 'checkov reviews the manifests'],
  ['Workflows', 'actionlint and zizmor review GitHub Actions'],
  ['Title', 'The title follows Conventional Commits']
];

export const commands = [
  ['make up', 'creates the cluster, installs the platform, builds the images and deploys'],
  ['make dashboards', 'opens the tools for operators'],
  ['make load', 'sends accountant traffic and fails if a single request fails'],
  ['make rollout', 'builds one image and releases it with a rolling update'],
  ['make check-policies', 'proves the 31 network paths'],
  ['make costs-on', 'starts Kubecost for a cost review, and costs-off stops it'],
  ['make stop', 'pauses the cluster with its data, and make down deletes it']
];

export const lessons = [
  ['Jaeger 2.20 removed an API', 'Grafana could not read traces', 'Pin 2.19 until Grafana uses the v3 API'],
  ['Kubecost 3 asks for 8 GB', 'It did not fit on a node of 3.5 GiB', 'Kubecost 2.8 on the same Prometheus, on demand'],
  ['The processor lost the trace', 'Jaeger refused Thrift v1, and the id was read late', 'JSON v2, and the id read at the start of the request'],
  ['A favicon voided the sign-in', 'A second flow expired the first one, with an error 500', 'Only page navigations go to Keycloak'],
  ['Kibana died on restart', 'Its migrations had no Node heap', 'A heap of 1 GiB, measured and documented'],
  ['The laptop ran out of memory', 'Load average of 54 and the API down as Keycloak started', 'Kubecost on demand, pinned pods and a capped Java heap']
];

export const compliance = [
  ['Rolling deployment', 'Four releases under load, 9,272 requests, 0 failed', 'make load with make rollout'],
  ['Network policies and storage', '31 paths proven, the list intact after a Redis restart', 'make check-policies'],
  ['Scaling by usage and dates', '2 to 4 replicas by load, 2 to 3 as a window opens', 'make load RATE=80'],
  ['Kubecost with its dashboard', 'Cost by namespace and service from Prometheus', 'make costs-on'],
  ['ELK for real time logs', 'Logs of the five services and events in Kibana', 'Kibana, PlazoFiscal logs'],
  ['Sign-in stronger than a password', 'Password and code before any route', 'Any name on :8000'],
  ['Dashboard with five signals', 'PlazoFiscal opens first in Grafana, with indicators', 'Grafana']
];

// Recorded on the reference machine. Durations fill in from the files.
export const videos = {
  '01': ['01-mfa-sign-in', 'Sign-in with a second factor', 'The application sends the browser to Keycloak, which asks for a password and a six digit code. A wrong code is refused.'],
  '02': ['02-application-flow', 'The application', 'The accountant signs in, sees obligations by due date with the calendar and registers a new one.'],
  '03': ['03-grafana-business-dashboard', 'Business dashboard', 'From the business indicators down to health, alerts, logs, traces and events.'],
  '04': ['04-grafana-cluster-dashboards', 'Cluster dashboards', 'Nodes, workloads, network, KEDA, the Redis volume and the alert rules.'],
  '05': ['05-kibana-logs-events', 'Logs and events in Kibana', 'Service logs, a filter by service, one document and Kubernetes events.'],
  '06': ['06-jaeger-trace-to-logs', 'From a trace to its logs', 'The sign-in trace, then an obligation followed from the frontend to the processor, and its id found in Kibana.'],
  '07': ['07-kubecost-costs', 'Costs in Kubecost', 'Overview, cost by namespace and by controller.'],
  '08': ['08-prometheus-alertmanager', 'Prometheus and Alertmanager', 'Replicas in Prometheus, scrape targets, alert rules and Alertmanager.'],
  '09': ['09-alert-end-to-end', 'An alert end to end', 'users-api at zero replicas fires PlazoFiscalServiceDown in Alertmanager, Grafana and the business dashboard.'],
  '10': ['10-autoscaling-dashboard', 'Scaling under load', 'The filing window holds 3 replicas, and k6 at 70 requests per second raised frontend and todos-api to 4, with 19,331 requests and none failed.'],
  '11': ['11-network-policies', 'Network policies proven', 'make check-policies opening every allowed path and trying every denied one.'],
  '12': ['12-rolling-update-under-load', 'A release under load', 'A rolling restart of the frontend under k6 at 15 requests per second, with 2,078 requests and none failed.']
};
