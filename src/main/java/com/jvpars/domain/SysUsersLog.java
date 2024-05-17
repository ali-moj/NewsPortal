package com.jvpars.domain;


import com.jvpars.selection.LogType;
import lombok.Data;

import javax.persistence.*;


@Entity
@Data
public class SysUsersLog extends BaseEntity{
	

	@ManyToOne
	private SysUser sysUser;

	@Lob
    private String message;

	private Long logDate;

	@Enumerated
	private LogType logType;


}
