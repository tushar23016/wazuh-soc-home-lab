
# 🛡️ Wazuh SOC Home Lab

<p align="center">
  <img src="https://img.shields.io/badge/SIEM-Wazuh-005571?style=for-the-badge&logo=securityscorecard&logoColor=white">
  <img src="https://img.shields.io/badge/Platform-VirtualBox-183A61?style=for-the-badge&logo=virtualbox&logoColor=white">
  <img src="https://img.shields.io/badge/Focus-SOC%20Analyst-2E8B57?style=for-the-badge">
  <img src="https://img.shields.io/badge/Status-In%20Progress-orange?style=for-the-badge">
</p>

<p align="center">
  A hands-on Security Operations Center (SOC) lab
  built to learn SIEM monitoring, threat detection,
  log analysis, and incident response.
</p>

---

## 📌 About the Project

The Wazuh SOC Home Lab is a cybersecurity project
designed to simulate how a Security Operations
Center monitors computers and servers for
suspicious activities.

The lab uses Wazuh as the central SIEM platform
to collect and analyze security logs from
Windows and Linux machines.

Kali Linux is used for authorized security testing
within the isolated lab environment.

The main goal is to understand how security
events are collected, detected, investigated,
and documented in a real-world SOC workflow.

## 🎯 Project Objectives

- Understand how a SIEM works in practice.
- Monitor Windows and Linux endpoints.
- Collect and analyze security event logs.
- Detect suspicious authentication attempts.
- Investigate security alerts using Wazuh.
- Create and test custom detection rules.
- Understand incident response workflows.
- Map security detections to MITRE ATT&CK.

## 🏗️ Lab Architecture

The lab consists of multiple virtual machines
connected through a virtual network.

### Architecture Diagram

![Wazuh SOC Lab Architecture](../architecture/soc-lab-architecture.png)

*Figure 1: SOC home lab architecture.*

The architecture diagram illustrates how the
endpoints communicate with the Wazuh server
and how security events reach the SIEM dashboard.

## 💻 Lab Environment

| Component | Purpose |
|-----------|---------|
| Ubuntu Server | Hosts the Wazuh server components. |
| Wazuh Manager | Analyzes events and generates security alerts. |
| Wazuh Dashboard | Displays alerts, agents, and security events. |
| Windows | Endpoint monitoring and security log collection. |
| Windows Server | Server monitoring and Active Directory practice. |
| Kali Linux | Authorized security testing and simulation. |
| Wazuh Agent | Sends endpoint security data to the Wazuh server. |
| VirtualBox | Runs and connects the virtual machines. |

## ⚙️ Key Features

### 1. Centralized Security Monitoring

Collect security events from multiple endpoints
and view them in a central Wazuh dashboard.

### 2. Log Analysis

Analyze Windows Event Logs and Linux
authentication logs to identify suspicious
activities and understand their meaning.

### 3. Threat Detection

Develop and test detections for activities such as:

- Repeated failed login attempts.
- Suspicious authentication activity.
- Unusual process execution.
- File modification and integrity changes.
- Suspicious network activity.

### 4. Endpoint Monitoring

Use Wazuh agents to monitor Windows and
Linux endpoints and forward security data
to the central Wazuh server.

### 5. Sysmon Integration

Integrate Microsoft Sysmon with Wazuh
to collect detailed Windows endpoint telemetry,
including process creation and network connections.

### 6. Incident Investigation

Document security incidents with:

- Incident description and severity.
- Detection evidence and relevant logs.
- Investigation steps and findings.
- Recommended response and remediation.

### 7. MITRE ATT&CK Mapping

Map relevant detection use cases to
MITRE ATT&CK techniques to understand
how attacker behavior can be identified.

## 🔍 SOC Use Cases

| ID | Use Case | Objective |
|----|----------|-----------|
| UC-01 | Brute-force detection | Identify repeated failed login attempts. |
| UC-02 | Suspicious login | Investigate unusual authentication events. |
| UC-03 | File Integrity Monitoring | Detect unauthorized file changes. |
| UC-04 | Suspicious processes | Investigate unusual process execution. |
| UC-05 | Server monitoring | Monitor Windows Server security events. |
| UC-06 | Linux authentication | Investigate SSH login activity. |

These use cases will be implemented and tested
as the lab develops.

## 📸 Dashboard & Evidence

### Wazuh Dashboard

![Wazuh Dashboard](../dashboards/screenshots/wazuh-dashboard.png)

*Figure 2: Wazuh SIEM dashboard.*

### Security Alerts

![Wazuh Security Alerts](../dashboards/screenshots/security-alerts.png)

*Figure 3: Security alerts generated during lab testing.*

Screenshots will be added after the corresponding
features and detection scenarios are implemented.

## 🧰 Tools & Technologies

| Category | Technology |
|----------|------------|
| SIEM | Wazuh |
| Operating Systems | Ubuntu Server, Windows, Windows Server, Kali Linux |
| Virtualization | Oracle VirtualBox |
| Endpoint Telemetry | Wazuh Agent, Microsoft Sysmon |
| Threat Framework | MITRE ATT&CK |
| Documentation | Markdown, Git, GitHub |

## 📈 Learning Outcomes

Through this project, I aim to develop practical
skills in:

- SIEM deployment and configuration.
- Security event monitoring and log analysis.
- Endpoint detection and alert investigation.
- Basic detection engineering.
- Incident documentation and response.
- Network and server security monitoring.

## 🔐 Disclaimer

This project is created for educational purposes
and authorized security testing.

All security testing is performed within
a controlled virtual lab environment.

No systems are tested without authorization.

---

<p align="center">
  <b>Wazuh SOC Home Lab | Learning by Building</b>
</p>