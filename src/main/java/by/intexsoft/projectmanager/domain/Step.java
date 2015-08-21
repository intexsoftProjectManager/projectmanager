package by.intexsoft.projectmanager.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.persistence.Table;

import by.intexsoft.projectmanager.enums.Priority;
import by.intexsoft.projectmanager.enums.Result;

@Entity
@Table (name="steps")
public class Step {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="step_id", unique=true, nullable=false)
	@PrimaryKeyJoinColumn
	public Long id;
	
	public Long number;
	
	public String expected;
	
	public String comment;
	
	@Column(nullable=false)
	@Enumerated(EnumType.STRING)
	public Priority priority = Priority.NONE;
	
	@Enumerated(EnumType.STRING)
	public Result result = Result.NOT_RUN;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "checklist_id", nullable = false)
	public CheckList checkList;
}
