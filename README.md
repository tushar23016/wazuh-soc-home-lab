# Wazuh SOC Home Lab

<p align="center">
  <strong>A hands-on Security Operations Center (SOC) home lab built with Wazuh and virtual machines.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Focus-SOC%20%7C%20Blue%20Team-63f0aa?style=for-the-badge" alt="SOC and Blue Team">
  <img src="https://img.shields.io/badge/Platform-Wazuh-2ea44f?style=for-the-badge" alt="Wazuh">
  <img src="https://img.shields.io/badge/Lab-Virtualized-2563eb?style=for-the-badge" alt="Virtualized lab">
</p>

A personal cybersecurity learning project documenting a virtualized SOC environment. The lab is intended for practicing endpoint monitoring, centralized log analysis, alert triage, detection validation, and incident-response documentation in a controlled environment.

> **Project status:** This repository is a learning lab and is updated as components are configured and tested. Screenshots and write-ups should reflect the actual state of the environment. A component listed as part of the lab is not necessarily installed, connected, or validated unless corresponding evidence is provided.

## Contents

- [Project Goals](#project-goals)
- [Lab Environment](#lab-environment)
- [Architecture and Event Flow](#architecture-and-event-flow)
- [Repository Structure](#repository-structure)
- [Project Modules](#project-modules)
- [Lab Setup Overview](#lab-setup-overview)
- [Evidence and Documentation](#evidence-and-documentation)
- [Safety and Responsible Use](#safety-and-responsible-use)
- [Learning Outcomes](#learning-outcomes)
- [Author](#author)

## Project Goals

- Build and document a virtualized SOC learning environment.
- Configure Wazuh and onboard supported endpoints as the lab progresses.
- Practice reviewing endpoint telemetry, security events, and alerts.
- Develop and test detection rules against authorized lab activity.
- Document investigation steps, findings, and lessons learned.
- Maintain an evidence-based portfolio of practical cybersecurity work.

## Lab Environment

The lab is organized around the following virtual machines in Oracle VirtualBox:

| Virtual machine | Intended role |
|---|---|
| Ubuntu Server | Host for the Wazuh server stack, according to the installed configuration. |
| Windows 11 | Windows endpoint for event collection and monitoring exercises. |
| Kali Linux | Security testing workstation for authorized activity within the lab. |
| Metasploitable 2 | Intentionally vulnerable target for controlled training exercises. |

Exact OS versions, VM resources, network modes, IP addresses, and service status should be documented in the relevant setup pages and screenshots. Do not assume every VM is currently running or connected to Wazuh.

## Architecture and Event Flow

The intended high-level workflow is:

```text
Windows / Linux endpoints
          |
          | Endpoint telemetry (where agents and sources are configured)
          v
      Wazuh server
          |
          | Alerts, event review, and investigation
          v
      SOC analyst
```

Kali Linux may be used to generate authorized test activity against lab systems. Metasploitable 2 is deliberately vulnerable and should remain isolated from public and production networks.

Architecture documentation and diagrams:

- [Lab Architecture](content/docs/lab-architecture.html)
- [Network Configuration](content/docs/network-configuration.html)
- [VM Inventory](content/architecture/vm-inventory.html)
- [SOC Architecture Diagram](content/architecture/soc-lab-architecture.png)
- [Network Topology](content/architecture/network-topology.png)

## Repository Structure

```text
wazuh-soc-home-lab/
├── index.html
├── README.md
├── LICENSE
├── .gitignore
├── pages/                       # Main website pages
├── content/
│   ├── docs/                    # Project and lab documentation
│   ├── architecture/            # Architecture diagrams and VM inventory
│   ├── setup/                   # OS, Wazuh, and agent setup guides
│   ├── detection-rules/         # Custom rules and validation notes
│   ├── log-analysis/            # Windows, Windows Server, and Linux analysis
│   ├── threat-detection/        # Controlled detection scenarios
│   ├── incident-response/       # Incident case documentation
│   ├── dashboards/              # Dashboard guide and screenshots
│   ├── scripts/                 # Helper scripts
│   └── reports/                 # Lab and testing reports
├── assets/
│   ├── css/                     # Stylesheets
│   ├── js/                      # Website scripts
│   ├── images/                  # Logos and backgrounds
│   ├── videos/                  # Optional website background video
│   └── icons/
└── documents/
    └── pdf/                     # Exported reports, when available
```

The repository may evolve as new lab modules and evidence are added.

## Project Modules

| Module | Description |
|---|---|
| [Project Overview](content/docs/project-overview.html) | Project scope, objectives, and learning goals. |
| [Lab Architecture](content/docs/lab-architecture.html) | Lab components, architecture, and evidence screenshots. |
| [Documentation](pages/documentation.html) | Entry point for setup and technical documentation. |
| [Detection Rules](pages/detection-rules.html) | Detection rule notes, custom rules, and testing. |
| [Log Analysis](pages/log-analysis.html) | Event analysis for supported endpoint platforms. |
| [Threat Detection](pages/threat-detection.html) | Controlled security scenarios and detection validation. |
| [Incident Response](pages/incident-response.html) | Investigation records and response workflow. |
| [Dashboards](pages/dashboards.html) | Wazuh dashboard guide and screenshots. |
| [Scripts](pages/scripts.html) | Supporting scripts and usage notes. |
| [Reports](pages/reports.html) | Lab setup, detection testing, and project reports. |

## Lab Setup Overview

This is a high-level workflow. Follow the detailed setup guides in the repository and adapt procedures to the versions and configuration actually used in your lab.

1. **Prepare virtualization.** Create the lab VMs in Oracle VirtualBox and record their resources and network adapter settings.
2. **Configure Ubuntu Server.** Set up the server environment and document relevant network and system configuration.
3. **Install and verify Wazuh.** Follow the Wazuh installation documentation and verify services using procedures appropriate to the installed version.
4. **Configure endpoint agents.** Install and enroll agents on supported endpoints, then verify their status and event ingestion.
5. **Validate telemetry.** Confirm expected log sources are enabled and test events appear in the monitoring platform.
6. **Document detections and investigations.** Record test conditions, alert and event details, evidence, results, and limitations.

See the platform-specific documentation under [`content/setup/`](content/setup/) as it is added.

## Evidence and Documentation

This project uses screenshots, configuration notes, diagrams, and reports to document the lab. Evidence should come from the actual environment and include enough context to understand what it demonstrates.

When adding evidence:

- Use descriptive filenames and store files in the relevant content folder.
- Add a short caption explaining what the screenshot demonstrates.
- Include dates or test identifiers where useful.
- Distinguish confirmed observations from assumptions or expected behavior.
- Remove passwords, access tokens, private keys, and sensitive personal or network information before publishing.

## Safety and Responsible Use

This repository is for education and authorized security testing only.

- Test only systems and networks you own or have explicit permission to assess.
- Keep Metasploitable 2 isolated from public, production, and other untrusted networks.
- Do not expose vulnerable services or intentionally insecure systems to the public internet.
- Use test accounts and non-sensitive data in the lab.
- Do not commit credentials, secrets, private keys, or sensitive logs to the repository.

## Learning Outcomes

Through this project, I am working to develop practical skills in:

- SIEM concepts and endpoint monitoring with Wazuh.
- Log collection, event interpretation, and alert triage.
- Detection-rule fundamentals and controlled validation.
- Basic incident investigation and evidence handling.
- Linux and Windows security monitoring.
- Technical documentation and security reporting.

## Author

**Tushar Mondal**  
Cybersecurity | SOC Analyst learning path

- GitHub: [tushar23016](https://github.com/tushar23016)
- LinkedIn: [Tushar Mondal](https://www.linkedin.com/in/tushar-mondal-8895402a7/)

---

<p align="center">
  <sub>Built for hands-on learning, documented as the lab evolves.</sub>
</p>
