package com.jvpars.domain;
import com.jvpars.utils.MyArgUtils;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import javax.persistence.*;
import javax.validation.constraints.NotEmpty;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity

public class SysUser  {
	@Id
	@GeneratedValue(strategy =  GenerationType.AUTO)
	@Column(name = "id")
	private Long id;


	@Version
	@Column(name = "version")
	private Integer version;

	@NotEmpty
	private String email;

	@NotEmpty
	private String role;

	@NotEmpty
	private String fullName;

	@NotEmpty
	private String password;

	private String tempPass;

	private String createdDate;

	private Long createdDateL;


	@PreUpdate
	@PrePersist
	public void addPostCost()  {
		createdDateL= MyArgUtils.nowEpoch();

	}

	@Override
	public String toString() {
		final StringBuilder sb = new StringBuilder("SysUser{");
		sb.append("id=").append(id);
		sb.append(", email='").append(email).append('\'');
		sb.append(", fullName='").append(fullName).append('\'');
		sb.append('}');
		return sb.toString();
	}
}
