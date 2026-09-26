
wazuh-soc-home-lab/
│
├── README.md
├── LICENSE
├── .gitignore
│
├── docs/
│   ├── project-overview.md
│   ├── lab-architecture.md
│   ├── network-configuration.md
│   ├── installation-guide.md
│   └── troubleshooting.md
│
├── architecture/
│   ├── soc-lab-architecture.png
│   ├── network-topology.png
│   └── vm-inventory.md
│
├── setup/
│   ├── ubuntu-server/
│   │   ├── installation.md
│   │   └── server-configuration.md
│   │
│   ├── wazuh-server/
│   │   ├── installation.md
│   │   ├── configuration.md
│   │   └── dashboard-setup.md
│   │
│   ├── wazuh-agent/
│   │   ├── windows-agent.md
│   │   ├── linux-agent.md
│   │   └── agent-troubleshooting.md
│   │
│   ├── windows/
│   │   ├── installation.md
│   │   ├── sysmon-installation.md
│   │   └── event-log-configuration.md
│   │
│   ├── windows-server/
│   │   ├── installation.md
│   │   ├── server-configuration.md
│   │   └── active-directory-setup.md
│   │
│   └── kali-linux/
│       ├── installation.md
│       └── lab-configuration.md
│
├── detection-rules/
│   ├── README.md
│   ├── custom-rules.xml
│   ├── rule-testing.md
│   └── mitre-attack-mapping.md
│
├── log-analysis/
│   ├── windows/
│   │   ├── authentication-events.md
│   │   ├── process-creation.md
│   │   └── sysmon-events.md
│   │
│   ├── windows-server/
│   │   ├── server-authentication.md
│   │   └── active-directory-events.md
│   │
│   └── linux/
│       ├── ssh-authentication.md
│       └── privilege-escalation.md
│
├── threat-detection/
│   ├── brute-force-detection.md
│   ├── suspicious-login.md
│   ├── suspicious-processes.md
│   ├── file-integrity-monitoring.md
│   └── network-activity.md
│
├── incident-response/
│   ├── README.md
│   ├── INC-001-brute-force.md
│   ├── INC-002-suspicious-login.md
│   └── INC-003-suspicious-process.md
│
├── dashboards/
│   ├── dashboard-guide.md
│   └── screenshots/
│       ├── wazuh-dashboard.png
│       ├── agent-status.png
│       ├── security-alerts.png
│       └── sysmon-events.png
│
├── scripts/
│   ├── linux/
│   ├── windows/
│   └── README.md
│
└── reports/
    ├── lab-setup-report.md
    ├── detection-testing-report.md
    └── final-project-report.md