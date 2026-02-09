---
layout: default
title: Cluster UG
date: 2025-09-25
categories: [location]
---

conda is not auto-loaded on the login node (`xlogin`), although it is installed on home directory. 

an interactive example:
```text
user@xlogin1:~$ salloc
salloc: Granted job allocation 7763
user@xlogin1:~$ srun --pty bash
user@xcnb0:~$ hostname
xcnb0
user@xcnb0:~$ exit
exit
user@xlogin1:~$ exit
exit
salloc: Relinquishing job allocation 7763
user@xlogin1:~$
```

Note: 
- for big job, always use compute nodes instead of login node.