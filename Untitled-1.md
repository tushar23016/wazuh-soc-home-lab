
wazuh-soc-home-lab/
│
├── index.html
├── README.md                 # GitHub repository overview
├── LICENSE                   # Keep license file
├── .gitignore
│
├── pages/
│   ├── architecture.html
│   ├── documentation.html
│   ├── detection-rules.html
│   ├── log-analysis.html
│   ├── threat-detection.html
│   ├── incident-response.html
│   ├── dashboards.html
│   ├── scripts.html
│   ├── reports.html
│   └── project-overview.html
│
├── content/
│   ├── docs/
│   │   ├── project-overview.html
│   │   ├── lab-architecture.html
│   │   ├── network-configuration.html
│   │   ├── installation-guide.html
│   │   └── troubleshooting.html
│   │
│   ├── architecture/
│   │   ├── soc-lab-architecture.png
│   │   ├── network-topology.png
│   │   └── vm-inventory.html
│   │
│   ├── setup/
│   │   ├── ubuntu-server/
│   │   │   ├── installation.html
│   │   │   └── server-configuration.html
│   │   │
│   │   ├── wazuh-server/
│   │   │   ├── installation.html
│   │   │   ├── configuration.html
│   │   │   └── dashboard-setup.html
│   │   │
│   │   ├── wazuh-agent/
│   │   │   ├── windows-agent.html
│   │   │   ├── linux-agent.html
│   │   │   └── agent-troubleshooting.html
│   │   │
│   │   ├── windows/
│   │   │   ├── installation.html
│   │   │   ├── sysmon-installation.html
│   │   │   └── event-log-configuration.html
│   │   │
│   │   ├── windows-server/
│   │   │   ├── installation.html
│   │   │   ├── server-configuration.html
│   │   │   └── active-directory-setup.html
│   │   │
│   │   └── kali-linux/
│   │       ├── installation.html
│   │       └── lab-configuration.html
│   │
│   ├── detection-rules/
│   │   ├── index.html
│   │   ├── custom-rules.xml
│   │   ├── rule-testing.html
│   │   └── mitre-attack-mapping.html
│   │
│   ├── log-analysis/
│   │   ├── windows/
│   │   │   ├── authentication-events.html
│   │   │   ├── process-creation.html
│   │   │   └── sysmon-events.html
│   │   ├── windows-server/
│   │   │   ├── server-authentication.html
│   │   │   └── active-directory-events.html
│   │   └── linux/
│   │       ├── ssh-authentication.html
│   │       └── privilege-escalation.html
│   │
│   ├── threat-detection/
│   │   ├── brute-force-detection.html
│   │   ├── suspicious-login.html
│   │   ├── suspicious-processes.html
│   │   ├── file-integrity-monitoring.html
│   │   └── network-activity.html
│   │
│   ├── incident-response/
│   │   ├── index.html
│   │   ├── INC-001-brute-force.html
│   │   ├── INC-002-suspicious-login.html
│   │   └── INC-003-suspicious-process.html
│   │
│   ├── dashboards/
│   │   ├── dashboard-guide.html
│   │   └── screenshots/
│   │       ├── wazuh-dashboard.png
│   │       ├── agent-status.png
│   │       ├── security-alerts.png
│   │       └── sysmon-events.png
│   │
│   ├── scripts/
│   │   ├── linux/
│   │   ├── windows/
│   │   └── index.html
│   │
│   └── reports/
│       ├── lab-setup-report.html
│       ├── detection-testing-report.html
│       └── final-project-report.html
│
├── assets/
│   ├── css/
│   │   ├── style.css
│   │   ├── responsive.css
│   │   └── animations.css
│   │
│   ├── js/
│   │   ├── main.js
│   │   ├── navigation.js
│   │   ├── documentation.js
│   │   ├── search.js
│   │   ├── gallery.js
│   │   └── viewer.js
│   │
│   ├── images/
│   │   ├── logo.svg
│   │   └── backgrounds/
│   │
│   ├── videos/
│   │   └── soc-background.mp4
│   │
│   └── icons/
│
└── documents/
    └── pdf/
        ├── lab-setup-report.pdf
        ├── detection-testing-report.pdf
        └── final-project-report.pdf



wazuh-soc-home-lab/
│
├── content/
│   ├── docs/
│   │   └── lab-architecture.html
│   │
│   ├── architecture/
│   │   ├── soc-lab-architecture.png
│   │   ├── network-topology.png
│   │   ├── vm-inventory.html
│   │   │
│   │   └── screenshots/                 ← CREATE THIS
│   │       ├── virtualbox-vms.png
│   │       ├── network-adapters.png
│   │       ├── wazuh-agents-status.png
│   │       └── wazuh-server-terminal.png