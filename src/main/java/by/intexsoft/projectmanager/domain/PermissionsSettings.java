package by.intexsoft.projectmanager.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToOne;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.persistence.Table;

@Entity
@Table (name="permissions_settings")
public class PermissionsSettings {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY )
	@Column(name = "perm_settings_id")
	@PrimaryKeyJoinColumn
	public Long id;
	
	public boolean viewIterationCalendar;
	public boolean addIterationCalendar;
	public boolean editIterationCalendar;
	public boolean viewAllIterations;
	
	public boolean viewProject = true;
	public boolean addProject;
	public boolean editProject;
	public boolean viewAllProjects;
	
	public boolean viewTaskCalendar;
	public boolean addTaskCalendar;
	public boolean editTaskCalendar;
	public boolean viewAllTaskCalendars;

	public boolean viewChecklist;
	public boolean addChecklist;
	public boolean editChecklist;
	public boolean viewAllChecklists;
	
	public boolean editPermissionsSettings;
	
	@OneToOne(mappedBy = "permissionsSettings")
	public User user;
}
